import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('myvideo') myVideo: ElementRef;
  @ViewChild('peerVideos') peerVideos: ElementRef;

  message: string;
  messages: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  startPreview() {
    this.chatService.startPreview(this.myVideo.nativeElement);
  }

  joinCall() {
    this.chatService.joinCall(this.peerVideos.nativeElement, this.myVideo.nativeElement);
  }
}
