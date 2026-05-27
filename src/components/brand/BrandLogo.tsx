import Image from "next/image";

type BrandLogoSize = "sm" | "md" | "lg";

const SIZE_CLASSNAME: Record<BrandLogoSize, string> = {
  sm: "w-[164px] md:w-[188px]",
  md: "w-[196px] md:w-[228px]",
  lg: "w-[224px] md:w-[272px]"
};

export function BrandLogo({
  size = "md",
  priority = false,
  className = ""
}: {
  size?: BrandLogoSize;
  priority?: boolean;
  className?: string;
}) {
  const widthClassName = SIZE_CLASSNAME[size];

  return (
    <span className={`brand-logo-shell ${widthClassName} ${className}`.trim()}>
      <Image
        src="/logo.png"
        alt="Bistró OS"
        width={2304}
        height={968}
        priority={priority}
        className="brand-logo-image h-auto w-full"
      />
    </span>
  );
}
