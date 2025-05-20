"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash, Upload, Save, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import useAdminDataStore from '@/lib/adminDataStore'
import { supabase } from '@/lib/supabase'

interface ImageItem {
  id: string
  src: string
  fileKey: string
  alt: string
  date: string
  area: string
  description: string
  featured: boolean
}

export default function ImageManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const setProgressImages = useAdminDataStore((state) => state.setProgressImages)

  const [images, setImages] = useState<ImageItem[]>([])

  const [newImage, setNewImage] = useState<Omit<ImageItem, "id">>({
    src: "",
    alt: "",
    date: new Date().toISOString().split("T")[0],
    area: "Cimentación",
    description: "",
    featured: false,
  })

  const updateGlobalImages = (updatedImages: ImageItem[]) => {
    setProgressImages(updatedImages)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const fetchImagesFromStorage = async () => {
    const { data, error } = await supabase.storage.from('progress-images').list('', { limit: 100, offset: 0 });
    if (error) {
      console.error('Error fetching images from storage:', error);
      return [];
    }
    // Fetch metadata from Supabase
    const { data: metaData, error: metaError } = await supabase.from('progress_images_meta').select('*');
    if (metaError) {
      console.error('Error fetching image metadata:', metaError);
    }
    return (data || []).map((file) => {
      const meta = (metaData || []).find((m) => m.id === file.name) || {};
      return {
        id: file.id || file.name,
        src: supabase.storage.from('progress-images').getPublicUrl(file.name).data.publicUrl,
        fileKey: file.name,
        alt: meta.alt || file.name,
        date: meta.date || new Date().toISOString().split('T')[0],
        area: meta.area || 'Cimentación',
        description: meta.description || '',
        featured: meta.featured || false,
      };
    });
  };

  const handleAddImage = async () => {
    setIsLoading(true)
    let imageUrl = newImage.src
    try {
      if (file) {
        const filePath = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('progress-images')
          .upload(filePath, file, { upsert: true })
        if (uploadError) {
          console.error('Upload error:', uploadError, JSON.stringify(uploadError));
          throw uploadError
        }
        const { data: publicUrlData } = supabase.storage
          .from('progress-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrlData.publicUrl
      }
      const newImageWithId = {
        ...newImage,
        id: Date.now().toString(),
        src: imageUrl,
      }
      const updatedImages = [...images, newImageWithId]
      setImages(updatedImages)
      updateGlobalImages(updatedImages)
      // Fetch images from storage and update state
      const storageImages = await fetchImagesFromStorage()
      if (storageImages.length > 0) {
        setImages(storageImages)
        updateGlobalImages(storageImages)
      }
      setNewImage({
        src: '',
        alt: '',
        date: new Date().toISOString().split('T')[0],
        area: 'Cimentación',
        description: '',
        featured: false,
      })
      setFile(null)
      setIsAddDialogOpen(false)
      toast({
        title: 'Imagen añadida',
        description: 'La nueva imagen ha sido añadida correctamente.',
      })
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAndSetImages = async () => {
    const storageImages = await fetchImagesFromStorage();
    setImages(storageImages);
    updateGlobalImages(storageImages);
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;
    setIsLoading(true);
    try {
      // Upsert metadata to Supabase
      await supabase.from('progress_images_meta').upsert({
        id: editingImage.fileKey,
        alt: editingImage.alt,
        date: editingImage.date,
        area: editingImage.area,
        description: editingImage.description,
        featured: editingImage.featured,
      });
      const updatedImages = images.map((img) => (img.id === editingImage.id ? editingImage : img));
      setImages(updatedImages);
      updateGlobalImages(updatedImages);
      setEditingImage(null);
      toast({
        title: "Imagen actualizada",
        description: "La imagen ha sido actualizada correctamente.",
      });
      await fetchAndSetImages();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar la imagen.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (imageToDelete && imageToDelete.fileKey) {
      const { error } = await supabase.storage.from('progress-images').remove([imageToDelete.fileKey]);
      if (error) {
        console.error('Error deleting image from Supabase:', error);
        toast({
          title: 'Error',
          description: `No se pudo eliminar la imagen: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }
    }
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    updateGlobalImages(updatedImages);
    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada correctamente.",
    });
    await fetchAndSetImages();
  };

  const handleDeleteSelected = async () => {
    const imagesToDelete = images.filter((img) => selectedImages.includes(img.id));
    const fileKeys = imagesToDelete.map((img) => img.fileKey).filter(Boolean);
    if (fileKeys.length > 0) {
      const { error } = await supabase.storage.from('progress-images').remove(fileKeys);
      if (error) {
        console.error('Error deleting selected images from Supabase:', error);
        toast({
          title: 'Error',
          description: `No se pudieron eliminar las imágenes: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }
    }
    const updatedImages = images.filter((img) => !selectedImages.includes(img.id));
    setImages(updatedImages);
    updateGlobalImages(updatedImages);
    setSelectedImages([]);
    toast({
      title: "Imágenes eliminadas",
      description: `${selectedImages.length} imágenes han sido eliminadas correctamente.`,
    });
    await fetchAndSetImages();
  };

  const handleToggleFeatured = async (id: string) => {
    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, featured: !img.featured } : img
    );
    setImages(updatedImages);
    updateGlobalImages(updatedImages);
    toast({
      title: "Estado actualizado",
      description: "El estado destacado de la imagen ha sido actualizado.",
    });
    await fetchAndSetImages();
  };

  const handleSelectImage = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedImages([...selectedImages, id])
    } else {
      setSelectedImages(selectedImages.filter((imgId) => imgId !== id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(images.map((img) => img.id))
    } else {
      setSelectedImages([])
    }
  }

  const handleSaveAllChanges = async () => {
    setIsLoading(true);
    try {
      // Upsert all metadata to Supabase
      const upserts = images.map(img => ({
        id: img.fileKey,
        alt: img.alt,
        date: img.date,
        area: img.area,
        description: img.description,
        featured: img.featured,
      }));
      await supabase.from('progress_images_meta').upsert(upserts);
      updateGlobalImages(images);
      toast({
        title: "Cambios guardados",
        description: "Todos los cambios han sido guardados correctamente.",
      });
      await fetchAndSetImages();
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron guardar los cambios.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString.includes("-")) {
      const [year, month, day] = dateString.split("-")
      return `${day}/${month}/${year}`
    }
    return dateString
  }

  useEffect(() => {
    const fetchAndSetImages = async () => {
      const storageImages = await fetchImagesFromStorage();
      if (storageImages.length > 0) {
        setImages(storageImages);
        updateGlobalImages(storageImages);
      }
    };
    fetchAndSetImages();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Imágenes</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Subir Imagen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir Nueva Imagen</DialogTitle>
                <DialogDescription>Sube una nueva imagen y completa la información relacionada.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="image-file">Archivo de Imagen</Label>
                  <Input id="image-file" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Texto Alternativo</Label>
                  <Input
                    id="image-alt"
                    value={newImage.alt}
                    onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                    placeholder="Descripción breve de la imagen"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-date">Fecha</Label>
                    <Input
                      id="image-date"
                      type="date"
                      value={newImage.date}
                      onChange={(e) => setNewImage({ ...newImage, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-area">Área</Label>
                    <Select value={newImage.area} onValueChange={(value) => setNewImage({ ...newImage, area: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cimentación">Cimentación</SelectItem>
                        <SelectItem value="Estructura">Estructura</SelectItem>
                        <SelectItem value="Fachada">Fachada</SelectItem>
                        <SelectItem value="Interior">Interior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-description">Descripción</Label>
                  <Textarea
                    id="image-description"
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    placeholder="Descripción detallada de la imagen"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="image-featured"
                    checked={newImage.featured}
                    onCheckedChange={(checked) => setNewImage({ ...newImage, featured: checked as boolean })}
                  />
                  <Label htmlFor="image-featured">Destacar en Galería</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddImage}>Subir Imagen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {selectedImages.length > 0 && (
            <Button variant="destructive" onClick={async () => await handleDeleteSelected()} className="gap-2">
              <Trash className="h-4 w-4" />
              Eliminar Seleccionadas ({selectedImages.length})
            </Button>
          )}
          <Button onClick={async () => await handleSaveAllChanges()} disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Vista de Cuadrícula</TabsTrigger>
          <TabsTrigger value="list">Vista de Lista</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  <SelectItem value="Cimentación">Cimentación</SelectItem>
                  <SelectItem value="Estructura">Estructura</SelectItem>
                  <SelectItem value="Fachada">Fachada</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="oldest">Más antiguas</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-grid"
                checked={selectedImages.length === images.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all-grid">Seleccionar todas</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card
                key={image.id}
                className={`overflow-hidden ${selectedImages.includes(image.id) ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={(checked) => handleSelectImage(image.id, checked as boolean)}
                        className="bg-white/80"
                      />
                    </div>
                    {image.featured && <Badge className="absolute top-2 right-2 z-10 bg-yellow-500">Destacada</Badge>}
                    <Image
                      src={(image.src ? image.src + `?t=${Date.now()}` : "/placeholder.svg")}
                      alt={image.alt}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">
                        {image.area}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(image.date)}
                      </div>
                    </div>
                    <p className="text-sm line-clamp-2">{image.description || image.alt}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center space-x-2 p-4 bg-background border-t border-border text-foreground">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingImage(image); setIsEditDialogOpen(true); }}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Dialog open={isEditDialogOpen && editingImage?.id === image.id} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) setEditingImage(null); }}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Imagen</DialogTitle>
                        <DialogDescription>Modifica los detalles de la imagen.</DialogDescription>
                      </DialogHeader>
                      {editingImage && (
                        <div className="grid gap-4 py-4">
                          <div className="relative h-48 mb-2">
                            <Image
                              src={(editingImage.src ? editingImage.src + `?t=${Date.now()}` : "/placeholder.svg")}
                              alt={editingImage.alt}
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-image-alt">Texto Alternativo</Label>
                            <Input
                              id="edit-image-alt"
                              value={editingImage.alt}
                              onChange={(e) => setEditingImage({ ...editingImage, alt: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-image-date">Fecha</Label>
                              <Input
                                id="edit-image-date"
                                type="date"
                                value={editingImage.date.split("/").reverse().join("-")}
                                onChange={(e) => setEditingImage({ ...editingImage, date: formatDate(e.target.value) })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-image-area">Área</Label>
                              <Select
                                value={editingImage.area}
                                onValueChange={(value) => setEditingImage({ ...editingImage, area: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar área" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Cimentación">Cimentación</SelectItem>
                                  <SelectItem value="Estructura">Estructura</SelectItem>
                                  <SelectItem value="Fachada">Fachada</SelectItem>
                                  <SelectItem value="Interior">Interior</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-image-description">Descripción</Label>
                            <Textarea
                              id="edit-image-description"
                              value={editingImage.description}
                              onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="edit-image-featured"
                              checked={editingImage.featured}
                              onCheckedChange={(checked) => setEditingImage({ ...editingImage, featured: checked as boolean })}
                            />
                            <Label htmlFor="edit-image-featured">Destacar en Galería</Label>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingImage(null); }}>
                          Cancelar
                        </Button>
                        <Button onClick={async () => { await handleUpdateImage(); setIsEditDialogOpen(false); setEditingImage(null); }}>
                          Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" onClick={async () => await handleDeleteImage(image.id)}>
                    <Trash className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Imágenes</CardTitle>
              <CardDescription>Gestiona todas las imágenes del proyecto.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        id="select-all-list"
                        checked={selectedImages.length === images.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Vista Previa</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Destacada</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedImages.includes(image.id)}
                          onCheckedChange={(checked) => handleSelectImage(image.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative h-16 w-16">
                          <Image
                            src={(image.src ? image.src + `?t=${Date.now()}` : "/placeholder.svg")}
                            alt={image.alt}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{image.alt}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{image.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{image.area}</Badge>
                      </TableCell>
                      <TableCell>{image.date}</TableCell>
                      <TableCell>
                        <Checkbox checked={image.featured} onCheckedChange={async () => await handleToggleFeatured(image.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingImage(image); setIsEditDialogOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={async () => await handleDeleteImage(image.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Galería</CardTitle>
              <CardDescription>Configura las opciones para la galería de imágenes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gallery-layout">Diseño de Galería</Label>
                <Select defaultValue="grid">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar diseño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Cuadrícula</SelectItem>
                    <SelectItem value="masonry">Mosaico</SelectItem>
                    <SelectItem value="carousel">Carrusel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images-per-page">Imágenes por Página</Label>
                <Select defaultValue="12">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 imágenes</SelectItem>
                    <SelectItem value="12">12 imágenes</SelectItem>
                    <SelectItem value="16">16 imágenes</SelectItem>
                    <SelectItem value="24">24 imágenes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-sort">Ordenación Predeterminada</Label>
                <Select defaultValue="newest">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar orden" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Más recientes primero</SelectItem>
                    <SelectItem value="oldest">Más antiguas primero</SelectItem>
                    <SelectItem value="area">Por área</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-quality">Calidad de Imagen</Label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar calidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja (carga rápida)</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail-size">Tamaño de Miniaturas</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeño</SelectItem>
                    <SelectItem value="medium">Mediano</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-lightbox">Habilitar Lightbox</Label>
                  <Checkbox id="enable-lightbox" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Permite ver las imágenes en pantalla completa al hacer clic en ellas.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-download">Permitir Descarga</Label>
                  <Checkbox id="enable-download" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Permite a los usuarios descargar las imágenes.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
