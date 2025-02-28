import { metadata } from "@/app/metadata";

export default function HomePage() {
  return (
    <div>
      <h1>{String(metadata.title)}</h1>
      <p>{String(metadata.description)}</p>
    </div>
  );
}
