import * as PDFJS from "pdfjs-dist";

const usePdfViewer = (node: HTMLCanvasElement, data: any) => {
    PDFJS.getDocument(data.url).promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = node;
            const context = canvas.getContext("2d");
            if (!context) {
                return;
            }
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext);
        });

    });


}

export default usePdfViewer