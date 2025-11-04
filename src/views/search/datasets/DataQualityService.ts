import axios from 'axios';
import mockData from './mock-data.json';
import mockDataDistr from './mock-data-distribution.json'

export async function getDatasetMetrics(datasetId: string) {
    const response = mockData;
    return response;
}

export async function getDistributionsMetrics(datasetId: string) {
    const response = mockDataDistr;

    return response;
}
