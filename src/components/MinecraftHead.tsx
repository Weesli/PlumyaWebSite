"use client";

import { useState } from "react";
import { User } from "lucide-react";

export default function MinecraftHead({ username }: { username: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="atlas-skin" aria-hidden="true">
      {failed ? <User size={21} /> : <img
        src={"https://mc-heads.net/avatar/" + encodeURIComponent(username) + "/64"}
        width={32}
        height={32}
        alt=""
        onError={() => setFailed(true)}
      />}
    </span>
  );
}
