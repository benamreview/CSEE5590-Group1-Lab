package com.csee5590.lab3;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;


public class LocationActivity extends FragmentActivity implements OnMapReadyCallback {
    private GoogleMap mMap;
    FusedLocationProviderClient mFusedLocationProviderClient;
    private static final String TAG = LocationActivity.class.getSimpleName();
    boolean mLocationPermissionGranted;
    private final LatLng mDefaultLocation = new LatLng(88.8523341, 151.2106085);
    private static final int DEFAULT_ZOOM = 15;
    private static final int PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 1;
    private Location mLastKnownLocation;


    //BUTTONS
    Button mbackBtn, mgetinfoBtn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        // Construct a FusedLocationProviderClient.
        // The LocationServices interface is responsible for returning the current location of the device
        mFusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);

        //Initialize the buttons
        mbackBtn = (Button) findViewById(R.id.backBtn);
        mgetinfoBtn = (Button) findViewById(R.id.getinfoBtn);

        //Set Listeners for Buttons
        mbackBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LocationActivity.this, EditDetailsActivity.class);
                startActivity(intent);
            }
        });
        mgetinfoBtn.setVisibility(View.GONE);
        mgetinfoBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(LocationActivity.this, GetInfoActivity.class);
                //        Extract Current Country Code and Name
                String country_code = (LocationActivity.this).getResources().getConfiguration().locale.getCountry();
                String country_name = (LocationActivity.this).getResources().getConfiguration().locale.getDisplayCountry();
                Toast.makeText(LocationActivity.this, country_name, Toast.LENGTH_SHORT).show();
                Log.d("Country Code", country_code);
                Log.d("Country Name", country_name);
//        Pass country code and name to the next activity
                intent.putExtra("country_name", country_name);
                intent.putExtra("country_code", country_code);
                intent.putExtra("lat", mLastKnownLocation.getLatitude());
                intent.putExtra("long", mLastKnownLocation.getLongitude());
                startActivity(intent);
            }
        });



    }
    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady (GoogleMap googleMap){
        mMap = googleMap;

        // Prompt the user for permission. If permission is denied, no location is provided
        getLocationPermission();

        //Based on the provided location permission
        //,turn on (or off) the My Location layer and the related control on the map.
        updateLocationUI();

        //Based on the provided location permission,
        // Get the current location of the device and set the position of the map.
        getDeviceLocation();

    }
    private void getLocationPermission() {
        /*
         * Request location permission, so that we can get the location of the
         * device. The result of the permission request is handled by a callback,
         * onRequestPermissionsResult.
         */
        /*There are many variables for location such as ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION, ... */
        if (ContextCompat.checkSelfPermission(this.getApplicationContext(),
                android.Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            mLocationPermissionGranted = true;
        } else {
            ActivityCompat.requestPermissions(this,
                    new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION},
                    PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION);
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String permissions[],
                                           @NonNull int[] grantResults) {
        mLocationPermissionGranted = false;
        switch (requestCode) {
            case PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    mLocationPermissionGranted = true;
                }
            }
        }
        //Update the location accordingly. If permission is not granted, location is not displayed
        updateLocationUI();
    }
    private void updateLocationUI() {
        if (mMap == null) {
            return;
        }
        try {
            if (mLocationPermissionGranted) {
                mMap.setMyLocationEnabled(true);
                mMap.getUiSettings().setMyLocationButtonEnabled(true);
            }
            else {
                //Update the location accordingly. If permission is not granted, location is not displayed
                //and last known location will be set to null

                //This will also call the getLocationPermission for the first time.
                mMap.setMyLocationEnabled(false);
                mMap.getUiSettings().setMyLocationButtonEnabled(false);
                mLastKnownLocation = null;
                getLocationPermission();
            }
        } catch (SecurityException e)  {
            Log.e("Exception: %s", e.getMessage());
        }
    }
    private void getDeviceLocation() {
        /*
         * Get the best and most recent location of the device, which may be null in rare
         * cases when a location is not available.
         */
        try {
            if (mLocationPermissionGranted) {
                Task<Location> locationResult = mFusedLocationProviderClient.getLastLocation();
                locationResult.addOnCompleteListener(this, new OnCompleteListener<Location>() {
                    @Override
                    public void onComplete(@NonNull Task<Location> task) {
                        if (task.isSuccessful()) {
                            mLastKnownLocation = task.getResult();
                            /*I modified this portion of the method because there is a tricky case
                             * such that even the FusedLocationProviderClient's getLastLocation was successful,
                             * the mLastKnownLocation is set to null for some reason. As a result,
                             * the getLatitude() and getLongitude() will crash the app due to errors from trying to
                             * access a null value*/
                            if (mLastKnownLocation == null) {
                                Log.d(TAG, "Current location is null. Using defaults.");
                                Log.e(TAG, "Exception: %s", task.getException());
                                mMap.moveCamera(CameraUpdateFactory
                                        .newLatLngZoom(mDefaultLocation, DEFAULT_ZOOM));
                                mMap.getUiSettings().setMyLocationButtonEnabled(false);
                            }
                            else {
                                // Set the map's camera position to the current location of the device.

                                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(
                                        new LatLng(mLastKnownLocation.getLatitude(),
                                                mLastKnownLocation.getLongitude()), DEFAULT_ZOOM));
                                mMap.addMarker(new MarkerOptions().position(new LatLng(mLastKnownLocation.getLatitude(),mLastKnownLocation.getLongitude() ))
                                        .title("Current Location"))
                                        .setSnippet("Latitude: " + mLastKnownLocation.getLatitude() + ", Longitude:" + mLastKnownLocation.getLongitude());
                                mMap.moveCamera(CameraUpdateFactory.newLatLng(new LatLng(mLastKnownLocation.getLatitude(),mLastKnownLocation.getLongitude() )));
                                mgetinfoBtn.setVisibility(View.VISIBLE);
                            }
                        } else {
                            Log.d(TAG, "Current location is null. Using defaults.");
                            Log.e(TAG, "Exception: %s", task.getException());
                            mMap.moveCamera(CameraUpdateFactory
                                    .newLatLngZoom(mDefaultLocation, DEFAULT_ZOOM));
                            mMap.getUiSettings().setMyLocationButtonEnabled(false);
                        }
                    }
                });
            }
        } catch (SecurityException e)  {
            Log.e("Exception: %s", e.getMessage());
        }
    }

}

