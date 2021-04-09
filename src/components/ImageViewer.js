import React from 'react';

/**
 * This class is for the image viewer part of the application, letting the currently logged in chatter view their uploaded media items
 * @author Jake Collins
 */

class ImageViewer extends React.Component {
  returnImageURL(imageURL) {
    alert(`Here is the URL of the desired image: ${imageURL}`)
  }
  render (){
    return(
      <>
      <div className={`overflow-y-scroll flex flex-row flex-wrap ${this.props.colorScheme.primary}`} id="imageArea">
                <div className={`h-12 py-3 text-lg w-full text-center ${this.props.colorScheme.primary}`}><p className={`${this.props.colorScheme.text}`}>Image Viewer</p></div>
                <div className={`${this.props.colorScheme.primary} ${this.props.colorScheme.text} w-full text-center`}><button type="button" onClick={(e) => this.props.returnToMessages()}>Return to Chat Messages</button></div>
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