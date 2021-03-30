import React from 'react';

class ImageViewer extends React.Component {
  returnImageURL(imageURL) {
    alert(`Here is the URL of the desired image: ${imageURL}`)
  }
  render (){
    return(
      <>
      <div className="overflow-y-scroll flex flex-row flex-wrap bg-yellow-500" id="imageArea">
                <div className="h-12 py-3 text-lg w-full bg-yellow-500"><p className="text-center">Image Viewer</p></div>
                <div className="bg-yellow-500 w-full text-center"><button type="button" onClick={(e) => this.props.returnToMessages()}>Return to Chat Messages</button></div>
                {Object.keys(this.props.userImages).map(key =>
                <div key={key} id={key}>
                    <button type="button" onClick={(e) => this.returnImageURL(this.props.userImages[key])}><img src={this.props.userImages[key]} alt={key} width="200px" height="200px"></img></button>
                </div>
                    )}
                </div>
      </>
    )
  }
}

export default ImageViewer