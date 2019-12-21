import kmeans from 'node-kmeans';

export function averageData(data) {
    var sumR = 0;
    var sumG = 0;
    var sumB = 0;
    var sumAlpha = 0;
    const length = data.length / 4;
    data.forEach((value, index) => {
        switch (index % 4) {
            case 0:
                sumR += value;
                break;
                
            case 1:
                sumG += value;
                break;
                
            case 2:
                sumB += value;
                break;
                
            case 3:
                sumAlpha += value;
                break;
                
            default:
                break;
        }
    });
    return [sumR, sumG, sumB, sumAlpha].map((value) => value/length);
}

export function getMedian(data) {
    // rValue means r in rgba, not related to l-values and r-values
    const rValues = new Array(256).fill(0);
    const gValues = new Array(256).fill(0);
    const bValues = new Array(256).fill(0);
    const aValues = new Array(256).fill(0);
    data.forEach((value, index) => {
        switch (index % 4) {
            case 0:
                rValues[value]++;
                break;
                
            case 1:
                gValues[value]++;
                break;
                
            case 2:
                bValues[value]++;
                break;
                
            case 3:
                aValues[value]++;
                break;
                
            default:
                break;
        }
    });
    return [rValues, gValues, bValues, aValues].map((array) => {
        let count = 0;
        for (let i=0; i<256; i++) {
            count += array[i];
            if (count >= data.length / 8) {
                return i;
            }
        }
        return 255;
    })
}

export async function getSimplifiedImage(data, imageWidth, imageHeight, width) {
    const tileSize = Math.floor(imageWidth/width);
    const height = Math.floor(imageHeight/tileSize);
    const newData = new Array(width*height);
    // truncate image at bottom
    for (var i=0; i<height; i++) {
        for (var j=0; j<width; j++) {
            // find out which tile the pixel belongs to
            for (var k=i*tileSize; k<(i+1)*tileSize; k++) {
                for (var l=j*tileSize; l<(j+1)*tileSize; l++) {
                    if (!newData[i*width+j]) {
                        newData[i*width+j] = [];
                    }
                    const pixel = k*imageWidth + l;
                    newData[i*width+j].push(data.slice(4*pixel, 4*pixel+4));
                }
            }
        }
    }
    return newData.map((array) => getMedian(array.reduce((a, b) => Array.from(a).concat(Array.from(b)))))
                  .reduce((a, b) => a.concat(b));
}

export async function getClusteredImage(data, K) {
    const matrix = [];
    for (var i=0; i<data.length; i+=4) {
        matrix.push(data.slice(i, i+4));
    }
    return new Promise((resolve) => kmeans.clusterize(matrix, {k: K}, (err, res) => {
        resolve(res);
    }));
}

export async function getResult(data, K) {
    const result = await getClusteredImage(data, K);
    for (const entry of result) {
        const indices = entry.clusterInd;
        const centroid = entry.centroid;
        for (const index of indices) {
            data.splice(index*4, 4, ...centroid);
        }
    }
    return data;
}











