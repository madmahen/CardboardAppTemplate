package com.eje_c.cardboardtemplate;

import android.os.Bundle;
import android.os.Vibrator;
import android.webkit.ValueCallback;

import com.google.vrtoolkit.cardboard.CardboardActivity;

import org.xwalk.core.XWalkPreferences;
import org.xwalk.core.XWalkView;


public class MainActivity extends CardboardActivity {
    private XWalkView webView;
    private Vibrator vibrator;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (BuildConfig.DEBUG) {
            XWalkPreferences.setValue(XWalkPreferences.REMOTE_DEBUGGING, true);
        }

        webView = (XWalkView) findViewById(R.id.webView);
        webView.loadAppFromManifest("file:///android_asset/manifest.json", null);

        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
    }

    @Override
    public void onCardboardTrigger() {
        vibrator.vibrate(50l);
        webView.evaluateJavascript("app.renderer.domElement.click();", null);
    }
}
