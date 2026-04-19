import { forwardRef } from "react";
import type { IDevice } from "../../../api/src/core/interfaces/IDevice";
import type { IUser } from "../../../api/src/core/interfaces/IUser";

interface TicketProps {
  device: IDevice;
}

// Usamos forwardRef para que la vista padre pueda mandar a imprimir este componente
export const RepairTicket = forwardRef<HTMLDivElement, TicketProps>(
  ({ device }, ref) => {
    const customer = device.ownerId as unknown as IUser; // Ya sabemos que viene poblado

    return (
      <div
        ref={ref}
        className="p-8 max-w-2xl mx-auto bg-white text-gray-800"
        style={{ fontFamily: "monospace" }}
      >
        {/* Cabecera del Taller */}
        <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
          <h1 className="text-2xl font-bold uppercase tracking-widest">
            Notebook Service Pro
          </h1>
          <p className="text-sm mt-1">Av. Falsa 123, Buenos Aires</p>
          <p className="text-sm">WhatsApp: +54 9 11 1234-5678</p>
          <p className="text-sm">Web: www.servicepro.com</p>
        </div>

        {/* Datos del Ticket */}
        <div className="flex justify-between text-sm mb-6 font-bold">
          <p>ORDEN N°: {device.id?.slice(-6).toUpperCase()}</p>
          <p>
            FECHA:{" "}
            {new Date(device.createdAt || Date.now()).toLocaleDateString(
              "es-AR",
            )}
          </p>
        </div>

        {/* Datos del Cliente */}
        <div className="border border-gray-300 p-4 mb-6">
          <h2 className="font-bold border-b border-gray-200 mb-2 uppercase">
            Datos del Cliente
          </h2>
          <p>
            <b>Nombre:</b> {customer?.fullName || "Consumidor Final"}
          </p>
          <p>
            <b>Teléfono:</b> {customer?.phoneNumber || "N/A"}
          </p>
          <p>
            <b>Email:</b> {customer?.email || "N/A"}
          </p>
        </div>

        {/* Datos del Equipo */}
        <div className="border border-gray-300 p-4 mb-6">
          <h2 className="font-bold border-b border-gray-200 mb-2 uppercase">
            Equipo Ingresado
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <b>Marca:</b> {device.brand}
            </p>
            <p>
              <b>Modelo:</b> {device.model}
            </p>
            <p>
              <b>S/N:</b> {device.serialNumber}
            </p>
            <p>
              <b>Procesador:</b> {device.specifications?.processor}
            </p>
          </div>
        </div>

        {/* Falla Reportada */}
        <div className="border border-gray-300 p-4 mb-6 bg-gray-50">
          <h2 className="font-bold border-b border-gray-200 mb-2 uppercase">
            Falla Declarada
          </h2>
          <p className="italic text-sm">"{device.faultDescription}"</p>
        </div>

        {/* Pie del Ticket (Legales) */}
        <div className="text-xs text-justify text-gray-500 border-t-2 border-dashed border-gray-400 pt-4 mt-8">
          <p className="mb-2 font-bold text-center">TÉRMINOS Y CONDICIONES</p>
          <p>
            1. El taller no se responsabiliza por la pérdida de datos. Se
            recomienda realizar un backup previo.
          </p>
          <p>
            2. Los presupuestos no aceptados tendrán un cargo por diagnóstico de
            $15.000 ARS.
          </p>
          <p>
            3. Pasados los 90 días de la notificación de retiro, el equipo se
            considerará abandonado.
          </p>
          <br />
          <div className="flex justify-between mt-8 text-center px-8">
            <div className="border-t border-gray-800 w-32 pt-1">
              Firma Cliente
            </div>
            <div className="border-t border-gray-800 w-32 pt-1">
              Firma Taller
            </div>
          </div>
        </div>
      </div>
    );
  },
);
