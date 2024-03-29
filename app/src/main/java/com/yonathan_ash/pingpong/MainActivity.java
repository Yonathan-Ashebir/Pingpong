package com.yonathan_ash.pingpong;

import static android.view.View.SYSTEM_UI_FLAG_FULLSCREEN;
import static android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
import static android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
import static android.view.WindowManager.LayoutParams.FLAG_FULLSCREEN;

import android.annotation.SuppressLint;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.snackbar.Snackbar;
import com.yonathan_ash.pingpong.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;
    private long lastFinishRequestTime = 0;
    private int gameState = -1;
    private Handler mainHandler;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        Preferences preferences = new Preferences(this);
        mainHandler = new Handler();
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
//            getWindow().setLayout(MATCH_PARENT, getWindowManager().getCurrentWindowMetrics().getBounds().bottom);//todo
//        }


        getWindow().addFlags(FLAG_FULLSCREEN);
        binding.webview.setSystemUiVisibility(SYSTEM_UI_FLAG_FULLSCREEN | SYSTEM_UI_FLAG_HIDE_NAVIGATION | SYSTEM_UI_FLAG_IMMERSIVE_STICKY);


        WebSettings settings = binding.webview.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setAllowFileAccess(true);
        settings.setSupportZoom(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(false);
        }
        Bridge bridge = new Bridge();
        binding.webview.addJavascriptInterface(bridge, "bridge");
        binding.webview.addJavascriptInterface(preferences, "preferences");
        binding.webview.addJavascriptInterface(this, "activity");
        binding.webview.loadUrl("javascript:enable()");
        binding.webview.loadUrl("/android_asset/index.html");

        setContentView(binding.getRoot());

    }

    @Override
    public void onBackPressed() {
        binding.webview.loadUrl("javascript:{notifyStatus();activity.requestExit()}");
//        super.onBackPressed();

    }

    @Override
    protected void onPause() {
        super.onPause();
        pauseGame();
        mainHandler.postDelayed(() -> binding.webview.pauseTimers(), 200);
    }

    @Override
    protected void onResume() {
        super.onResume();
        binding.webview.resumeTimers();
    }

    private void pauseGame() {
        mainHandler.post(() -> {
            binding.webview.loadUrl("javascript:if(window.pauseGame)window.pauseGame();");
        });
    }

    @JavascriptInterface
    public void requestExit() {

        if (gameState == 2) {//todo: hardcoded
            pauseGame();
            return;
        }
        long ct = System.currentTimeMillis();
        if (ct - lastFinishRequestTime < 700) {
            this.finish();
        } else {
            Snackbar snackbar = Snackbar.make(binding.webview, "Sure you want to quit." , 1200);
            snackbar.setBackgroundTint(0xffffffff);
            snackbar.setActionTextColor(0xdd0000ff);
            snackbar.setTextColor(0xdd000000);
            snackbar.setAction("Close", v -> {
                if (lastFinishRequestTime - System.currentTimeMillis() < 700)
                    MainActivity.this.finish();
            });
            snackbar.show();
            snackbar.setAnchorView(binding.anchor);
        }
        lastFinishRequestTime = System.currentTimeMillis();
    }

    @JavascriptInterface
    public void trackStatus(int status) {
        gameState = status;

    }

    @Override
    @JavascriptInterface
    public void finish() {
        super.finish();
    }
}