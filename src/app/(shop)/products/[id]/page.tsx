type Props = { params: { id: string } };

export default function ProductDetailsPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Product Details</h1>
      <p className="text-sm text-gray-600 mt-2">ID: {params.id}</p>
    </main>
  );
}