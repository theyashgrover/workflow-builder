import { toPng } from 'html-to-image';
import { FiDownload } from 'react-icons/fi';

function downloadImage(dataUrl) {
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function handleDownload() {
  toPng(document.querySelector('.react-flow__viewport'))
    .then(downloadImage)
    .catch(error => console.error('Error downloading image:', error));
}

function DownloadButton() {
  return (
    <button className="flex items-center text-lg shadow-sm text-[#1e1e1e] bg-white rounded-full hover:bg-slate-800 hover:scale-105 ease-in-out duration-150 pr-1 pl-1 py-3 hover:text-white" onClick={handleDownload}>
      <FiDownload className='mx-2'/>
    </button>
  );
}

export default DownloadButton;
