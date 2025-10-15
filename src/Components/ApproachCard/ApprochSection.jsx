import { Link } from "react-router-dom"

Link

const ApprochSection = () => {
  return (
    <div>
      <h1 className="text-left pl-12  text-2xl md:text-3xl mt-10 font-bold">
  The Allbirds Approach
</h1>

{/* Bottom 3 blocks: center aligned always */}
<div className="flex mb-7 flex-col lg:flex-row items-center justify-center gap-10 px-4 mt-8 text-left">
  {/* Block 1 */}
  <div className="max-w-md">
    <h2 className="text-lg md:text-xl font-bold mb-2">
      Wear-All-Day Comfort
    </h2>
    <p className="text-sm md:text-base mb-3 leading-relaxed text-gray-700">
      Experience lightweight support and breathable materials that make your
      daily moves feel effortless. Our shoes are designed with all-day comfort
      in mind — from your morning walk to your evening wind-down. Step into a
      pair and feel the difference with every stride.
    </p>
    <Link to="/learn">
      <p className="underline text-blue-600 hover:text-blue-800 transition">
        Learn More
      </p>
    </Link>
  </div>

  {/* Block 2 */}
  <div className="max-w-md">
    <h2 className="text-lg md:text-xl font-bold mb-2">
      Sustainability In Every Step
    </h2>
    <p className="text-sm md:text-base mb-3 leading-relaxed text-gray-700">
      Every material, process, and shipment is optimized to reduce carbon
      emissions. We're actively measuring and minimizing our environmental
      footprint. Our mission is to leave the planet better than we found it —
      not someday, but now.
    </p>
    <Link to="/sustainabilityPage">
      <p className="underline text-blue-600 hover:text-blue-800 transition">
        Learn More
      </p>
    </Link>
  </div>

  {/* Block 3 */}
  <div className="max-w-md">
    <h2 className="text-lg md:text-xl font-bold mb-2">
      Materials From The Earth
    </h2>
    <p className="text-sm md:text-base mb-3 leading-relaxed text-gray-700">
      We harness nature's best: wool, tree fiber, and sugarcane — sustainable
      alternatives to petroleum-based synthetics. Our goal is to use materials
      that are softer on your feet and gentler on the planet.
    </p>
    <Link to="/MaterialsPage">
      <p className="underline text-blue-600 hover:text-blue-800 transition">
        Learn More
      </p>
    </Link>
  </div>
</div>

    </div>
  )
}

export default ApprochSection
