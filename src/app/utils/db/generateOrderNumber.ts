import crypto from "crypto"

export function generateOrderNumber(userName: string): string {
  const initials = userName
    .split(" ")
    .map((name) => name[0]?.toUpperCase())
    .join("")
    .slice(0, 2) || "XX" // fallback caso não tenha nome

  const now = new Date()
  const year = now.getFullYear().toString().slice(2) // "25"
  const month = String(now.getMonth() + 1).padStart(2, "0") // "08"

  const number = Math.floor(100 + Math.random() * 900) // 100–999
  const letters = crypto.randomBytes(2).toString("hex").toUpperCase().slice(0, 2)

  return `${initials}${year}${month}-${number}${letters}` // Ex: AD2508-123CK
}

export default generateOrderNumber;
