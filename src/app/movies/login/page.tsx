import { redirect } from "next/navigation";

export default function MoviesLoginRedirectPage() {
  redirect("/admin/login?next=/movies");
}
