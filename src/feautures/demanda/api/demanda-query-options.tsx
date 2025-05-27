import { queryOptions } from '@tanstack/react-query'
import { obtenerDiaActualDemanda } from './obtener-dia-actual-demanda'

export const demandaQueryOptions = queryOptions({
    queryKey: ['demanda'],
    queryFn: () => obtenerDiaActualDemanda()
})
