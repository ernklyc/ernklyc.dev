"use client";

import type { HTMLMotionProps } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import { FaYoutube, FaTiktok, FaApple } from "react-icons/fa";
import IconButton from "@/components/ui/IconButton";
import type { HeroContent } from "@/lib/siteContent";

interface SocialLinksProps {
  links: HeroContent["links"];
  iconClassName?: string;
  whileHover?: HTMLMotionProps<"a">["whileHover"];
}

/**
 * Hero ve Footer'daki sosyal medya ikonlarının TEK ortak kaynağı. Admin
 * panelden (/admin/content/hero) doldurulan linkleri okur — GitHub,
 * LinkedIn ve e-posta her zaman gösterilir; Play Store, YouTube, App Store
 * ve TikTok sadece admin bir link girmişse gösterilir.
 */
export default function SocialLinks({ links, iconClassName, whileHover }: SocialLinksProps) {
  const iconClass = iconClassName ?? "w-5 h-5 text-gray-300 group-hover:text-[#A9B7C4] transition-colors duration-300";
  // IconButton'ın kendi varsayılanıyla aynı — explicit geçmezsek undefined
  // spread edilip varsayılanı ezmesin diye burada sabitliyoruz.
  const hover = whileHover ?? { scale: 1.1, y: -2 };

  return (
    <>
      <IconButton href={links.github} whileHover={hover} aria-label="GitHub">
        <FiGithub className={iconClass} />
      </IconButton>

      <IconButton href={links.linkedin} whileHover={hover} aria-label="LinkedIn">
        <FiLinkedin className={iconClass} />
      </IconButton>

      <IconButton href={`mailto:${links.email}`} external={false} whileHover={hover} aria-label="Email">
        <FiMail className={iconClass} />
      </IconButton>

      {links.playStore && (
        <IconButton href={links.playStore} whileHover={hover} aria-label="Google Play Store">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            className={iconClass}
            fill="currentColor"
          >
            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.6 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
          </svg>
        </IconButton>
      )}

      {links.appStore && (
        <IconButton href={links.appStore} whileHover={hover} aria-label="App Store">
          <FaApple className={iconClass} />
        </IconButton>
      )}

      {links.youtube && (
        <IconButton href={links.youtube} whileHover={hover} aria-label="YouTube">
          <FaYoutube className={iconClass} />
        </IconButton>
      )}

      {links.tiktok && (
        <IconButton href={links.tiktok} whileHover={hover} aria-label="TikTok">
          <FaTiktok className={iconClass} />
        </IconButton>
      )}
    </>
  );
}
