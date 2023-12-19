import React, { useState, useEffect } from 'react'
// Material UI Imports
import { Backdrop, Fade, Modal } from '@mui/material';
import ImageBlob from  '../animations/ImageBlob';
import { ImageBlobCon } from '../animations/AnimationElements';

import { ModalCircularProgress, QuoteGeneratorModalCon, QuoteGeneratorModalInnerCon, QuoteGeneratorSubTitle, QuoteGeneratorTitle } from './NewsGeneratorElements';

import AnimatedDownloadButton from '../animations/AnimatedDownloadButton';
import RenderHtml from './renderSVG';




interface  QuoteGeneratorModalProps{
    open : boolean ,
    close : () => void ;
    processingQuote: boolean;
    setProcessingQuote: React.Dispatch<React.SetStateAction<boolean>>;
    quoteReceived: String | null;
    setQuoteReceived: React.Dispatch<React.SetStateAction<String | null>>;

}
const style = {

};


const QuoteGeneratorModal = ( {open, close,processingQuote,setProcessingQuote,quoteReceived,setQuoteReceived }: QuoteGeneratorModalProps )=>{
    
    
    const wiseDevQuote = '"In a world of choices, let your app guide the way with insightful advice."';

    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    
    const [lines,setLines] = useState<string[] | null>(null);
    // Function: Handling the download of quote card
    const handleDownload = () => {
        if (quoteReceived) {
            // Create a Blob from the SVG markup
            const blob = new Blob([quoteReceived], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
    
            // Create a link and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'quote.svg'; // File name for download
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    // Function: Handle the receiving of quote card
    useEffect(() => {
        if (quoteReceived) {
            const binaryData = Buffer.from(quoteReceived, 'base64');
            const blob = new Blob([binaryData], { type: 'image/svg' });
            const blobUrlGenerated = URL.createObjectURL(blob);
            console.log(blobUrlGenerated);
            setBlobUrl(blobUrlGenerated);
            setLines(quoteReceived)
            return () => {
                URL.revokeObjectURL(blobUrlGenerated);
            }
        }
    }, [quoteReceived])
    
    return (
    <Modal 
     id="QuoteGeneratorModal"
            aria-labelledby="spring-modal-quotegeneratormodal"
            aria-describedby="spring-modal-opens-and-closes-quote-generator"
            open={open}
            onClose={close}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
    
   
    >
         <Fade in ={open} >
        <QuoteGeneratorModalCon sx={style}>
<QuoteGeneratorModalInnerCon>
  {/* State #1: Processing request of quote + quote state is empty */}
  {(processingQuote === true && quoteReceived === null) && 
                            <>
                                <ModalCircularProgress
                                    size={"8rem"}
                                    thickness={2.5}
                                />
                                <QuoteGeneratorTitle>
                                    Creating your advice...
                                </QuoteGeneratorTitle>
                                <QuoteGeneratorSubTitle style={{marginTop: "20px"}}>
                                    {wiseDevQuote}
                                </QuoteGeneratorSubTitle>
                            </>
}
{
(quoteReceived !== null && lines !== null) &&
<>
<QuoteGeneratorTitle>
                                    Download your advice!
                                </QuoteGeneratorTitle>
                                <QuoteGeneratorSubTitle style={{marginTop: "20px"}}>
                                    See a preview:
                                </QuoteGeneratorSubTitle>
                               
                                <AnimatedDownloadButton
                                    handleDownload={handleDownload}
                                />
                                <RenderHtml lines={lines}>

                                </RenderHtml>
                           
</>}





</QuoteGeneratorModalInnerCon>
        </QuoteGeneratorModalCon>
        </Fade>

    </Modal>
    )
}
export default QuoteGeneratorModal;