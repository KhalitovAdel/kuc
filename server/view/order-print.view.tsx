import React from 'react';
import { Worker, Viewer,  RenderPageProps } from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import { getFilePlugin } from '@react-pdf-viewer/get-file';

const CustomPageLayer: React.FC<{
    renderPageProps: RenderPageProps,
}> = ({ renderPageProps }) => {
    React.useEffect(() => {
        // Mark the page rendered completely when the canvas layer is rendered completely
        // So the next page will be rendered
        if (renderPageProps.canvasLayerRendered) {
            renderPageProps.markRendered(renderPageProps.pageIndex);
        }
    }, [renderPageProps.canvasLayerRendered]);

    return (
        <>
            {renderPageProps.canvasLayer.children}
            {renderPageProps.annotationLayer.children}
        </>
    );
};

const renderPage = (props: RenderPageProps) => <CustomPageLayer renderPageProps={props} />;

export default function OrderView(props: {record: { params: {id: number} }}) {
    const url = `/orderPrint/${props.record.params.id}`;

    const toolbarPluginInstance = toolbarPlugin();
    const getFilePluginInstance = getFilePlugin({
        fileNameGenerator: () => `КазанскийТехнадзор-осмотр-${props.record.params.id}.pdf`
    });

    const { Toolbar } = toolbarPluginInstance;

    return <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
        <div
            className="rpv-core__viewer"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                maxWidth: '600px',
                maxHeight: '800px'
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    padding: '4px',
                }}
            >
                <Toolbar>
                    {() => {
                        return (
                            <>
                                <div style={{ padding: '0px 2px' }}>
                                    {getFilePluginInstance.DownloadButton()}
                                </div>
                            </>
                        );
                    }}
                </Toolbar>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer
                    fileUrl={url}
                    renderPage={renderPage}
                    plugins={[toolbarPluginInstance, getFilePluginInstance]}
                />
            </div>
        </div>
    </Worker>
}