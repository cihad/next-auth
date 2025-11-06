import { Navbar } from "@/components/app/navbar";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
