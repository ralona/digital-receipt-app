import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Home, History, FileText, Eye, HelpCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  onShowPreview?: () => void;
  onShowInstructions?: () => void;
  showPreviewButton?: boolean;
  showInstructionsButton?: boolean;
  showMobileInfoButton?: boolean;
}

export function FloatingNav({ 
  onShowPreview, 
  onShowInstructions, 
  showPreviewButton = false,
  showInstructionsButton = false,
  showMobileInfoButton = false 
}: FloatingNavProps) {
  const [location] = useLocation();
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  
  // Check if we're in mobile environment
  const isMobile = !!(window as any).Capacitor || 
                   window.location.protocol === 'file:' ||
                   navigator.userAgent.includes('wv') ||
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Inicio",
      active: location === "/",
    },
    {
      href: "/history",
      icon: History,
      label: "Historial",
      active: location === "/history",
    },
  ];

  return (
    <>
      {/* Floating Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="bg-surface/95 backdrop-blur-sm border shadow-lg">
          <div className="flex items-center space-x-2 p-3">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-2 px-3",
                    item.active && "bg-primary text-primary-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* Divider */}
            {(showPreviewButton || showInstructionsButton || (showMobileInfoButton && isMobile)) && (
              <div className="w-px h-8 bg-border mx-2" />
            )}

            {/* Preview Button */}
            {showPreviewButton && onShowPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowPreview}
                className="flex flex-col items-center gap-1 h-auto py-2 px-3"
              >
                <Eye className="h-4 w-4" />
                <span className="text-xs">Vista Previa</span>
              </Button>
            )}

            {/* Instructions Button */}
            {showInstructionsButton && (
              <Sheet open={instructionsOpen} onOpenChange={setInstructionsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-xs">Ayuda</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-foreground">
                      Instrucciones de Uso
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">Complete el Formulario</h3>
                        <p className="text-sm text-muted-foreground">
                          Ingrese el importe, nombres del pagador y receptor. La fecha se puede modificar si es necesario.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">Cargar Firma (Opcional)</h3>
                        <p className="text-sm text-muted-foreground">
                          Suba su firma en formato PNG o JPEG para mayor autenticidad del recibo.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">Generar y Guardar</h3>
                        <p className="text-sm text-muted-foreground">
                          Descargue el PDF o guárdelo directamente en Google Drive para respaldo.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">Historial y Reutilización</h3>
                        <p className="text-sm text-muted-foreground">
                          Acceda al historial para ver recibos anteriores y copie los datos para crear uno nuevo.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium text-foreground mb-2">Consejos</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• La vista previa se actualiza en tiempo real</li>
                        <li>• Todos los importes están en euros</li>
                        <li>• Las firmas tienen un límite de 2MB</li>
                        <li>• La fecha se puede cambiar según sea necesario</li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">Versión</h3>
                        <span className="text-sm text-muted-foreground">v1.0</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Mobile Info Button - Only show in history page and if mobile */}
            {showMobileInfoButton && isMobile && (
              <Sheet open={mobileInfoOpen} onOpenChange={setMobileInfoOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                  >
                    <Smartphone className="h-4 w-4" />
                    <span className="text-xs">Móvil</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-foreground flex items-center">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Modo Móvil
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-green-800">
                          Modo Móvil Activado
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Estás usando la aplicación en un dispositivo móvil con funciones avanzadas de compartir.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Características disponibles:</h3>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Compartir nativo</h4>
                          <p className="text-xs text-muted-foreground">
                            Comparte recibos directamente por WhatsApp, email, Telegram, etc.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Firmas incluidas</h4>
                          <p className="text-xs text-muted-foreground">
                            Los recibos con firma se comparten correctamente
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Guardado local</h4>
                          <p className="text-xs text-muted-foreground">
                            Los PDFs se guardan en la carpeta Documentos del dispositivo
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium text-foreground mb-2">Cómo usar:</h3>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        <li>1. Genera un recibo como de costumbre</li>
                        <li>2. Toca "Compartir Recibo" para abrir el menú nativo</li>
                        <li>3. Elige la app donde quieres compartir el PDF</li>
                      </ol>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}