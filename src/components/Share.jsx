"use Client"
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import Sudoku from '@/components/Sudoku';
import { FaWhatsapp, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';


// Use <FaWhatsapp />, <FaTwitter />, and <FaLinkedin /> in your Dialog component


const Share = () => {
  const sudokuRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleDownload = async () => {
    const canvas = await html2canvas(sudokuRef.current);
    const image = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement('a');
    link.href = image;
    link.download = 'sudoku-challenge.jpg';
    link.click();
  };

  const handleShare = async () => {
    const canvas = await html2canvas(sudokuRef.current);
    const image = canvas.toDataURL("image/jpeg");
    setImageUrl(image);
    setShowDialog(true);
  };

  return (
    <div>
      <div ref={sudokuRef}>
        <Sudoku />
      </div>
      <p>Challenge your friend to solve this problem!</p>
      <button onClick={handleDownload}>Download as JPG</button>
      <button onClick={handleShare}>Share</button>
      {showDialog && (
        <Dialog imageUrl={imageUrl} onClose={() => setShowDialog(false)} />
      )}
    </div>
  );
};

const Dialog = ({ imageUrl, onClose }) => {
  const websiteUrl = "https://yourwebsite.com"; // Change to your actual website URL

  return (
    <div className="dialog">
      <button onClick={onClose}>Close</button>
      <Image src={imageUrl} alt="Sudoku Challenge" style={{ width: '100%' }} />
      <p>Share this Sudoku challenge on:</p>
      <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(websiteUrl + ' ' + imageUrl)}`} target="_blank" rel="noopener noreferrer">
        <i>WhatsApp Icon</i> WhatsApp
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent('Try this Sudoku challenge!')}&via=yourusername`} target="_blank" rel="noopener noreferrer">
        <i>Twitter Icon</i> Twitter
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`} target="_blank" rel="noopener noreferrer">
        <i>LinkedIn Icon</i> LinkedIn
      </a>
    </div>
  );
};

export default Share;
