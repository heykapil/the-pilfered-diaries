import { IconSeparator } from "@tabler/icons";
import React from "react";

export default function SectionBreak() {
  return (
    <div className="py-3 mt-1 w-100 d-flex justify-content-center gap-2 text-primary">
      <IconSeparator size={18} />
      <IconSeparator size={18} />
      <IconSeparator size={18} />
    </div>
  );
}
