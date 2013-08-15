package com.mop.audiotext;

import android.content.Context;
import android.graphics.*;
import android.util.AttributeSet;
import android.util.Log;
import android.view.*;

public class AudioView extends SurfaceView implements SurfaceHolder.Callback {
    Context ctx;
    SurfaceHolder myHolder;
    int pos = 0;

    public AudioView(Context c, AttributeSet attrs) {
        super(c, attrs);
        ctx = c;
        setup();

        Log.d("AudioView", "I AM ALIVE (attr)");
    }

    public AudioView(Context c) {
        super(c);
        setup();

        Log.d("AudioView", "I AM ALIVE (simple)");
    }

    private void setup() {
        myHolder = getHolder();
        myHolder.addCallback(this);

        setVisibility(VISIBLE);

        Log.d("AudioView", "setup()");
    }

    public void drawAudio(byte[] audio) {
        Canvas canvas = myHolder.lockCanvas();

        Paint p = new Paint(Color.WHITE);

        for(int i=0; i < audio.length - 1; i++) {
            canvas.drawLine(pos, audio[i], pos+1, audio[i+1], p);
            pos++; if(pos > canvas.getWidth() - 1) pos = 0;
        }

        myHolder.unlockCanvasAndPost(canvas);
    }

    public void surfaceCreated(SurfaceHolder holder) {
        myHolder = holder;

        Log.d("AudioView", "SURFACE IS ALIVE");
    }

    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {}
    public void surfaceDestroyed(SurfaceHolder holder) {}
}