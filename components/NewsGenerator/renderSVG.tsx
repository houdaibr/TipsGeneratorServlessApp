// RenderHtml.tsx
import React, { useEffect, useState } from 'react';

interface RenderHtmlProps {
    html: string;
    lines: string; // List of variables to render inside <tspan>
  }
  

const RenderHtml: React.FC<RenderHtmlProps> = ({ html, lines }) => {
    const [renderedHtml, setRenderedHtml] = useState<{ __html: string }>({ __html: '' });
  
    useEffect(() => {
      // Use dangerouslySetInnerHTML to render HTML content
      setRenderedHtml({ __html: html });
    }, [html]);
  
    return (
      <div style={{ width: '673px', height: '650px', margin: '0 auto' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 750 483">
          <style>
            {`.title { 
               fill: #ffffff; 
               font-size: 20px; 
               font-weight: bold;
            }
            .footerStyles {
               font-size: 20px;
               font-weight: bold;
               fill: lightgrey;
               text-anchor: middle;
               font-family: Verdana;
            }
            `}
          </style>
  
          <circle cx="382" cy="76" r="44" fill="rgba(255, 255, 255, 0.155)" />
          <text x="382" y="76" dy="50" text-anchor="middle" font-size="90" font-family="Verdana" fill="white">
            "
          </text>
          <g>
            <rect x="0" y="0" width="750" height="auto"></rect>
            <text id="lastLineOfQuote" x="375" y="120" font-family="Verdana" font-size="35" fill="white" text-anchor="middle">
            
                <tspan >
                  {lines}
                </tspan>
             
            </text>
          </g>
          <text x="375" y="473" className="footerStyles">Developed by @Houda | https://api.adviceslip.com/</text>
        </svg>
      </div>
    );
  };
  
  export default RenderHtml;
