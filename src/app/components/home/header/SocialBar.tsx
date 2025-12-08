import { SOCIAL_LINKS } from "@/lib/header/constants";

export function SocialBar() {
  return (
    <div className="hidden sm:block bg-secondary py-2 border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
        <div className="flex items-center space-x-4">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <Icon className="w-4 h-4 text-white hover:text-primary/70 cursor-pointer transition-all duration-200" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
