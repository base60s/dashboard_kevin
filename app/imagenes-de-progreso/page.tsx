"use client"

import { useState } from "react"
import PageHeader from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Upload, Filter } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAdminDataStore from "@/lib/adminDataStore"
import { type ImageItem } from "@/components/admin/image-management"

export default function ImagenesDeProgresoPage() {
  const [date, setDate] = useState({
    from: new Date(2025, 0, 1),
    to: addDays(new Date(), 0),
  })

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = useAdminDataStore((state) => state.progressImages)

  return (
    <>
      <PageHeader title="Imágenes de Progreso - Edificio Corporativo Zenith">
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </PageHeader>

      <main className="p-4">
        <Tabs defaultValue="todas">
          <TabsList className="mb-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="cimentacion">Cimentación</TabsTrigger>
            <TabsTrigger value="estructura">Estructura</TabsTrigger>
            <TabsTrigger value="fachada">Fachada</TabsTrigger>
            <TabsTrigger value="interior">Interior</TabsTrigger>
          </TabsList>

          <TabsContent value="todas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image: ImageItem) => (
                <Card key={image.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Dialog open={selectedImage === image.id} onOpenChange={(open) => setSelectedImage(open ? image.id : null)}>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer relative">
                          <Image
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            width={600}
                            height={400}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                            <div className="font-medium">{image.area}</div>
                            <div className="text-xs">{image.date}</div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogTitle className="sr-only">Imagen de Progreso</DialogTitle>
                        <div className="flex flex-col space-y-2">
                          <Image
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            width={1200}
                            height={800}
                            className="w-full object-contain max-h-[70vh]"
                          />
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{image.area}</h3>
                              <p className="text-sm text-muted-foreground">{image.date}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Descargar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cimentacion">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images
                .filter((img: ImageItem) => img.area === "Cimentación")
                .map((image: ImageItem) => (
                  <Card key={image.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Dialog open={selectedImage === image.id} onOpenChange={(open) => setSelectedImage(open ? image.id : null)}>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer relative">
                            <Image
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              width={600}
                              height={400}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                              <div className="font-medium">{image.area}</div>
                              <div className="text-xs">{image.date}</div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogTitle className="sr-only">Imagen de Progreso</DialogTitle>
                          <div className="flex flex-col space-y-2">
                            <Image
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              width={1200}
                              height={800}
                              className="w-full object-contain max-h-[70vh]"
                            />
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{image.area}</h3>
                                <p className="text-sm text-muted-foreground">{image.date}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Similar content for other tabs */}
        </Tabs>
      </main>
    </>
  )
}
