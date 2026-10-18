import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually to ensure MONGODB_URI is loaded
const envPath = path.resolve(__dirname, "../.env");
let mongoUri = process.env.MONGODB_URI;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("MONGODB_URI=") && !trimmed.startsWith("#")) {
      mongoUri = trimmed.replace("MONGODB_URI=", "").trim();
      if (
        (mongoUri.startsWith('"') && mongoUri.endsWith('"')) ||
        (mongoUri.startsWith("'") && mongoUri.endsWith("'"))
      ) {
        mongoUri = mongoUri.slice(1, -1);
      }
      break;
    }
  }
}

const fallbackUri = "mongodb://127.0.0.1:27017/makeup-artist";

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

async function upsertAdmin(email, rawPassword, name = "Admin") {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(rawPassword.trim(), 10);

  const existing = await AdminUser.findOne({ email: normalizedEmail });
  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`Updated existing admin: ${normalizedEmail}`);
  } else {
    await AdminUser.create({
      name,
      email: normalizedEmail,
      passwordHash,
    });
    console.log(`Created new admin: ${normalizedEmail}`);
  }

  const verify = await AdminUser.findOne({ email: normalizedEmail });
  const isMatch = await bcrypt.compare(rawPassword.trim(), verify.passwordHash);
  return { email: normalizedEmail, isMatch };
}

async function setCredentials(uri) {
  console.log(`Connecting to MongoDB at: ${uri.replace(/:([^@]+)@/, ":****@")}...`);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("Connected successfully!");

  // Parse any CLI arguments (e.g., node set-admin.mjs admin@zoommobiles.in admin123)
  const args = process.argv.slice(2).filter((a) => !a.startsWith("mongodb"));
  const inputEmail = args[0];
  const inputPassword = args[1] || "admin123";

  const emailsToConfigure = [
    "admin@zoommobiles.in",
    "admin@makeup.com",
  ];

  if (inputEmail && !emailsToConfigure.includes(inputEmail.toLowerCase().trim())) {
    emailsToConfigure.unshift(inputEmail.toLowerCase().trim());
  }

  console.log("\n===========================================");
  console.log(" Configuring Admin Accounts");
  console.log("===========================================");

  for (const email of emailsToConfigure) {
    const res = await upsertAdmin(email, inputPassword, "Admin Artist");
    console.log(` > ${res.email} | Password: ${inputPassword} | Verified: ${res.isMatch}`);
  }

  console.log("===========================================\n");

  await mongoose.disconnect();
}

async function main() {
  const targetUri = mongoUri || fallbackUri;
  try {
    await setCredentials(targetUri);
    process.exit(0);
  } catch (err) {
    console.warn(`Connection to primary URI failed (${err.message}).`);
    if (targetUri !== fallbackUri) {
      console.log(`Attempting fallback to local MongoDB (${fallbackUri})...`);
      try {
        await setCredentials(fallbackUri);
        process.exit(0);
      } catch (fallbackErr) {
        console.error("Fallback connection also failed:", fallbackErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

main();
