import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">ReWear</h1>
          <p className="mb-4 text-lg">A community clothing exchange platform for sustainable fashion.</p>
          <div className="flex gap-4 mb-4">
            <Link href="/login"><button className="bg-blue-600 text-white px-4 py-2 rounded">Start Swapping</button></Link>
            <Link href="/items"><button className="bg-green-600 text-white px-4 py-2 rounded">Browse Items</button></Link>
            <Link href="/items/add"><button className="bg-purple-600 text-white px-4 py-2 rounded">List an Item</button></Link>
          </div>
        </div>
        {/* Carousel for featured items will go here */}
        <div className="w-full md:w-1/2 h-48 bg-gray-200 flex items-center justify-center rounded">Carousel Placeholder</div>
      </div>
      {/* Categories section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <div className="flex gap-4 flex-wrap">
          <span className="bg-gray-100 px-3 py-1 rounded">Men</span>
          <span className="bg-gray-100 px-3 py-1 rounded">Women</span>
          <span className="bg-gray-100 px-3 py-1 rounded">Kids</span>
          <span className="bg-gray-100 px-3 py-1 rounded">Accessories</span>
        </div>
      </div>
      {/* Product Listing Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Featured Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product cards will be rendered here */}
          <div className="bg-white p-4 rounded shadow">
            <div className="h-40 bg-gray-200 mb-2 rounded">Image</div>
            <div className="font-bold">Title</div>
            <div>Size: M</div>
            <div>Available</div>
          </div>
          {/* ...more cards */}
        </div>
      </div>
    </div>
  );
}
