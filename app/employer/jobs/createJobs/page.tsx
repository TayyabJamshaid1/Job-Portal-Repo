"use client";

import JobCreationForm from '@/app/components/Job-Creation';
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import { debounce } from "lodash";
// import { useMemo } from "react";

// const LIMIT = 4;
// type Category = {
//   slug: string;
//   name: string;
//   url: string;
// };

// export default function Products() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const skip = Number(searchParams.get("skip")) || 0;
//   const limit = Number(searchParams.get("limit")) || LIMIT;
//   const q = searchParams.get("q") || "";
//   const category = searchParams.get("category") || "";

//   // -----------------------------
//   // Update URL search params
//   // -----------------------------
//   const updateSearchParams = (updates: Record<string, string | null>) => {
//     const params = new URLSearchParams(searchParams.toString());

//     Object.entries(updates).forEach(([key, value]) => {
//       if (value === null || value === "") {
//         params.delete(key);
//       } else {
//         params.set(key, value);
//       }
//     });

//     router.push(`${pathname}?${params.toString()}`);
//   };

//   // -----------------------------
//   // Debounced search
//   // -----------------------------
//   const debouncedSearch = useMemo(
//     () =>
//       debounce((value: string) => {
//         updateSearchParams({
//           skip: "0",
//           q: value,
//           category: null,
//         });
//       }, 1000),
//     [searchParams]
//   );

//   // -----------------------------
//   // Fetch categories
//   // -----------------------------
// const { data: categories } = useQuery<Category[]>({
//   queryKey: ["categories"],
//   queryFn: async () =>
//     fetch("https://dummyjson.com/products/categories").then((res) =>
//       res.json()
//     ),
// });


//   // -----------------------------
//   // Fetch products
//   // -----------------------------
//   const { data: products, isLoading } = useQuery({
//     queryKey: ["products", skip, limit, q, category],
//     queryFn: async () => {
//       let url = `https://dummyjson.com/products/search?limit=${limit}&skip=${skip}&q=${q}`;

//       if (category) {
//         url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
//       }

//       return fetch(url).then((res) => res.json());
//     },
//     staleTime: 60_000,
//     placeholderData: keepPreviousData,
//   });

//   // -----------------------------
//   // Pagination
//   // -----------------------------
//   const handleMove = (value: number) => {
//     updateSearchParams({
//       skip: String(Math.max(skip + value, 0)),
//       limit: String(limit),
//     });
//   };

//   // -----------------------------
//   // UI
//   // -----------------------------
//   return (
//     <div className="bg-white">
//       <div className="mx-auto max-w-7xl px-4 py-16">
//         <h2 className="text-2xl font-bold mb-6">My Store</h2>

//         {/* Search + Category */}
//         <div className="flex gap-6 mb-6">
//           <input
//             defaultValue={q}
//             onChange={(e) => debouncedSearch(e.target.value)}
//             placeholder="Search iPhone..."
//             className="w-full border px-4 py-2 rounded"
//           />

//         <select
//   value={category}
//   onChange={(e) =>
//     updateSearchParams({
//       skip: "0",
//       category: e.target.value,
//       q: null,
//     })
//   }
//   className="border px-4 py-2 rounded"
// >
//   <option value="">Select category</option>

//   {categories?.map((cat) => (
//     <option key={cat.slug} value={cat.slug}>
//       {cat.name}
//     </option>
//   ))}
// </select>

//         </div>

//         {/* Products */}
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {products?.products.map((product: any) => (
//               <div key={product.id} className="border rounded p-4">
//                 <img
//                   src={product.thumbnail}
//                   alt={product.title}
//                   className="h-40 w-full object-cover mb-3"
//                 />
//                 <h3 className="font-semibold">{product.title}</h3>
//                 <p className="text-sm text-gray-500">{product.category}</p>
//                 <p className="font-bold mt-1">${product.price}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         <div className="flex gap-4 mt-10">
//           <button
//             disabled={skip === 0}
//             onClick={() => handleMove(-LIMIT)}
//             className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           <button
//             disabled={skip + limit >= (products?.total ?? 0)}
//             onClick={() => handleMove(LIMIT)}
//             className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react'

const page = () => {
  return (
    <div>
      <JobCreationForm/>
    </div>
  )
}

export default page