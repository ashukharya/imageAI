import {useState,useRef} from "react"


const Modal=({setModalOpen,setSelectedImage,selectedImage,generateVariations})=>{
    const [error,setError]=useState(null)
    const ref=useRef(null)
console.log("selectedImage",selectedImage)
    const closeModal=()=>{
        setModalOpen(false)
        setSelectedImage(null)
    }

    const checkSize=()=>{
        if(ref.current.width===256 && ref.current.height===256){
            //generate Variations
            generateVariations()
        }else{
            setError('Error: Size Should be 256x256')
        }
    }

    return(
        <div className="modal">
            <div onClick={closeModal}>X</div>
            <div className="img-container">
                {selectedImage && <img ref={ref} src={URL.createObjectURL(selectedImage)} alt="uploaded image"/>}
            </div>
            <p>{error || "* Image size must be 256x256"}</p>
            {!error && <button onClick={checkSize}>Generate</button>}
            {error && <button onClick={closeModal}>Close & try again</button>}
        </div>
    )
}

export default Modal