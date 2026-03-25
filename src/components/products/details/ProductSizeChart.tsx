import { Product } from "@/types/product";

type Props = {
  sizeChart: Product["sizeChart"];
};

export default function ProductSizeChart({ sizeChart }: Props) {
  if (!sizeChart) return null;

  return (
    <div>
      <h3 className="text-[22px] font-medium">Size Chart</h3>

      <div className="mt-3 overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full text-center text-xs text-black">
          <thead>
            <tr className="">
              <th className="border-r border-b border-gray-300  bg-gray-100 px-4 py-3 font-medium text-black">
                Size
              </th>
              {sizeChart.columns.map((col) => (
                <th
                  key={col}
                  className="border-r border-b border-gray-300 bg-gray-100 px-4 py-3 font-medium text-black last:border-r-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sizeChart.rows.map((row) => (
              <tr key={row.label} className="bg-white">
                <td className="border-r border-b border-gray-300 px-4 py-3 font-medium text-black">
                  {row.label}
                </td>

                {row.values.map((v, i) => (
                  <td
                    key={`${row.label}-${i}`}
                    className="border-r border-b border-gray-300 px-4 py-3 last:border-r-0 text-black "
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-black/35">
        {sizeChart.unit ? `${sizeChart.unit}*` : "Inches*"}
      </p>
    </div>
  );
}
