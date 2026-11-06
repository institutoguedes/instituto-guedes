import { Marca } from "@/components/Marca";
import { StaffDock } from "@/components/StaffDock";

export function MolduraEquipe({ children }: { children: React.ReactNode }) {
  return (
    <div className="com-dock">
      <Marca compact />
      {children}
      <StaffDock />
    </div>
  );
}
