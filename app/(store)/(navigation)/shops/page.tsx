import { Metadata } from "next";
import SimpleShopsTest from "./simple-test";

export const metadata: Metadata = {
  title: "Shops",
  description: "Browse all shops and their reels",
};

export default function ShopsPage() {
  return <SimpleShopsTest />;
}