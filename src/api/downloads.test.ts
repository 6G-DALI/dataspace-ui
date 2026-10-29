import { describe, expect, it } from 'vitest'
import { isDataLakeFile } from './downloads'

describe('isDataLakeFile', () => {
  const cat = '6g-dali-hesso'
  it('is a file in the catalogue bucket', () => {
    expect(isDataLakeFile(`http://sparks-prod07.sparkworks.net:9000/${cat}/d37424ff/9a7e.pcap`, cat)).toBe(true)
  })
  it('is not a file of another bucket, a bucket root, a link with a query or an external page', () => {
    expect(isDataLakeFile('http://h:9000/6g-dali-other/d/x.csv', cat)).toBe(false)
    expect(isDataLakeFile(`http://h:9000/${cat}/`, cat)).toBe(false)
    expect(isDataLakeFile(`http://h:9000/${cat}/d/x.csv?X-Amz-Signature=1`, cat)).toBe(false)
    expect(isDataLakeFile('https://zenodo.org/records/1/files/x.csv', cat)).toBe(false)
    expect(isDataLakeFile('not a url', cat)).toBe(false)
    expect(isDataLakeFile(`http://h:9000/${cat}/d/x.csv`, '')).toBe(false)
  })
})
