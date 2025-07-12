export default function ProductDetailPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Product Detail</h2>
      {/* Image gallery, description, uploader info, metadata, swap/redeem buttons */}
      <div className="h-60 bg-gray-200 mb-2 rounded">Image Gallery</div>
      <div className="font-bold">Title</div>
      <div>Description</div>
      <div>Uploader: Name/Email</div>
      <div>Size, Category, Tags, Condition, Status</div>
      <div className="flex gap-4 mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Swap Request</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Redeem via Points</button>
      </div>
    </div>
  );
}
