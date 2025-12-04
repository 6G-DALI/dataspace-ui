import axios from 'axios';
import appConfig from '../../../../config/appConfig'

export async function getDatasetMetrics(datasetId: string) {
    const response = await axios.get(`${appConfig.piveauDataQualityUrl}datasets/${datasetId}`)
    return response.data;
}

export async function getDistributionsMetrics(datasetId: string) {
    const response = await axios.get(`${appConfig.piveauDataQualityUrl}datasets/${datasetId}/distributions`)
    return response.data;
}