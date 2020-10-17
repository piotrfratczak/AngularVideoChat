import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:3000';
  private socket;
  private myPeer;
  private myStream;
  private peers = [];

  public startPreview(videoElement) {
    videoElement.muted = true;

    navigator.getUserMedia({
      video: true,
      audio: true
    }, stream => {
      this.myStream = stream;
      this.addVideoStream(videoElement, this.myStream);
    },  error => {
      console.warn(error.message);
    });
  }

  public joinCall(videoContainer, videoElement) {
    if (this.myStream === undefined) {
      this.startPreview(videoElement);
    }
    
    this.socket = io(this.url);

    this.myPeer = new Peer(undefined);

    this.myPeer.on('open', (id) => {
      this.socket.emit('join-room', id);
    });

    this.myPeer.on('call', (call) => {
      call.answer(this.myStream);
      const video = document.createElement('video');
      videoContainer.appendChild(video);
      call.on('stream', (remoteStream) => {
        this.addVideoStream(video, remoteStream);
      });
    });

    this.socket.on('user-joined', (userId) => {
      this.connectToNewUser(userId, this.myStream, videoContainer);
    });

    this.socket.on('user-left', (userId) => {
      if (this.peers[userId]) this.peers[userId].close();
    });
  }

  private connectToNewUser(userId, stream, videoContainer) {
    const call = this.myPeer.call(userId, stream);
    const video = document.createElement('video');
    videoContainer.appendChild(video);
    call.on('stream', (remoteStream) => {
      this.addVideoStream(video, remoteStream);
    });
    call.on('close', () => {
      video.remove();
    });

    this.peers[userId] = call;
  }

  private addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    })
  }

}

