export function resolveRole(user, roleMap = {}, superAdminEmails = []) {
  const email = (user?.email || "").toLowerCase().trim();
  if (!email) return "customer";

  const normalizedSuperAdmins = superAdminEmails.map((e) =>
    String(e).toLowerCase().trim()
  );
  if (normalizedSuperAdmins.includes(email) || roleMap[email] === "super_admin") {
    return "super_admin";
  }

  if (roleMap[email]) return roleMap[email];
  return "customer";
}
