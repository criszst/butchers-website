'use client';

import { getStoreSettings, StoreSettingsData } from "@/app/actions/store-settings";
import React, { useEffect, useState } from "react";

export default function Footer(): React.JSX.Element {
 const [store, setStore] = useState<StoreSettingsData | null>(null)
 const [isLoading, setIsLoading] = useState(true)
 
   useEffect(() => {
     const getSettings = async () => {
       if (isLoading) 
         return getStoreSettings().then((storeData) => {
       setStore(storeData.settings as StoreSettingsData)
       })
     }
 
     getSettings()

     setIsLoading(false)
   }, [isLoading])

   if (isLoading) return <p>Loading...</p>

   if (window.location.pathname.startsWith("/orders")) return <></>


  return (
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-orange-400">{store?.storeName}</h3>
                <p className="text-gray-300 mb-4">
                  {store?.storeDescription}
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <span className="text-sm font-bold">@</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Contato</h4>
                <div className="space-y-2 text-gray-300">
                  <p>📍 Rua das Carnes, 123 - Centro</p>
                  <p>📞 {store?.storePhone}</p>
                  <p>✉️ {store?.storeEmail}</p>
                  <p>🕒 {store?.businessHours}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Categorias</h4>
                <div className="space-y-2 text-gray-300">
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Carnes Bovinas</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Carnes Suínas</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Aves</p>
                  <p className="hover:text-orange-400 cursor-pointer transition-colors">Linguiças</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Casa de Carne Duarte. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
  );
}