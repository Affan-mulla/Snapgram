import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from '../ui/button'


const FileUploader = ({fieldChange, mediaUrl}) => {

    const [file, setFile] = useState([])
    const [fileUrl, setFileUrl] = useState(mediaUrl)

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
      }, [file])

      
      const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            'image/*' : ['.png', '.jpg', '.svg', '.jpeg']
        }

      })

  return (
    <div {...getRootProps()} className='flex flex-center flex-col rounded-xl cursor-pointer bg-dark-3'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
        fileUrl ?(
            <>
            <div className='flex flex-1 justify-center w-full p-5 md:p-10'>
                <img src={fileUrl} alt="image"
                className='file_uploader-img' />

                
            </div>
            <p className='file_uploader-label'>Click Or Drag photo here to replace</p>
            </>
        ) : (
            <div className='file_uploader-box'>
                <img src="/assets/icons/file-upload.svg" alt="fileupload"
                width={96}
                height={77} />

                <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag Photo Here</h3>

                <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>

                <Button className='shad-button_dark_4'>
                    Select From Device
                </Button>

            </div>
        )
          
      }
    </div>
  )
}

export default FileUploader