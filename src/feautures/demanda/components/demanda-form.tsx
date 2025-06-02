import { Link, useSearch } from "@tanstack/react-router";
import type { DemandaData } from "../types/demanda-type"
import { DemandaChart } from "./demanda-chart";

interface DemandaFormProps {
    demandaData: DemandaData[]
}
export const DemandaForm = ({ demandaData }: DemandaFormProps) => {
    console.log('DemandaForm demandaData:', demandaData);
    const { sistema, gerencia } = useSearch({
        from: "/demanda/",
    })

    console.log('DemandaForm sistema:', sistema);
    console.log('DemandaForm gerencia:', gerencia);
    const allDemandByFilter = demandaData.filter((data) => {
        if (gerencia) {
            return data.Sistema === sistema && data.Gerencia === gerencia;
        } else {
            return data.Sistema === sistema;
        }
    })
    // const allDemandBySistema = demandaData.filter((data) => data.Sistema === sistema);
    // console.log('DemandaForm allDemandBySistema:', allDemandBySistema);
    // // Group by HoraOperacion
    const grouped = Object.groupBy(allDemandByFilter, item => item.HoraOperacion);
    console.log('DemandaForm grouped:', grouped);
    // // Now create a new array with the grouped data
    const allDemandByHora = Object.entries(grouped).map(([HoraOperacion, items]) => ({
        HoraOperacion: HoraOperacion,
        Demanda: items?.reduce((sum, item) => sum + item.Demanda, 0), // Sum the Demanda values
        Generacion: items?.reduce((sum, item) => sum + item.Generacion, 0), // Sum the Generacion values
        Pronostico: items?.reduce((sum, item) => sum + item.Pronostico, 0), // Sum the Pronostico values
    }));
    // console.log('DemandaForm allDemandByHora:', allDemandByHora);

    if (!demandaData || demandaData.length === 0) {
        return <div>Cargando datos...</div>;
    }


    return (
        <>
            <iframe src='https://www.cenace.gob.mx/GraficaDemandaHistorica.aspx' width="1000" height="600" title="Government Data Graph"></iframe>
            <div>DemandaForm</div>
        </>
    )
}
