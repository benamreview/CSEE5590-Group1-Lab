package com.csee5590.lab3;

import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;


import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

public class GetInfoActivity extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;
    String country_code;
    ArrayList<String> neighbors = new ArrayList<String>();
    private ArrayList<String> items;
    private ListView listView;
    ArrayAdapter<String> itemsAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_get_info);
        mAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();
        Intent intent = getIntent();
        country_code = intent.getStringExtra("country_code");
        String country_name = intent.getStringExtra("country_name");
        Log.d("Country Code 2", country_code);
        Log.d("Country Name 2", country_name);
        String url = "https://restcountries.eu/rest/v2/alpha/"  + country_code;
        RequestQueue queue = Volley.newRequestQueue(this);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.GET, url, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d("Response","Response: " + response.toString());
                        try {
                            savetoDB(response);
                            displayInfo(response);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
//                        catch (ParseException e) {
//                            e.printStackTrace();
//                        }
                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("Error","Response ERROR!");
                    }
                });
        queue.add(jsonObjectRequest);
        listView = (ListView) findViewById(R.id.listView);
        items = new ArrayList<String>();
        ArrayAdapter<String> itemsAdapter =
                new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, items);
        listView.setAdapter(itemsAdapter);
    }
    private void savetoDB(JSONObject obj) throws JSONException{
        String user_id = mAuth.getCurrentUser().getUid();
        Intent intent = getIntent();
        Map<String, Object> country = new HashMap<>();
        country.put("name", obj.get("name"));
        country.put("capital", obj.get("capital"));
        JSONArray array = (JSONArray) obj.get("currencies");
        List<String> data = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            JSONObject row = array.getJSONObject(i);
            String currencyname = row.getString("name");
            data.add(currencyname);

        }
        country.put("currencies", data);
        country.put("checkin_time", currentDate());
        country.put("latitude", intent.getDoubleExtra("lat", 0));
        country.put("longitude", intent.getDoubleExtra("long", 0));
        country.put("population", obj.get("population"));

        array = (JSONArray) obj.get("borders");
        for (int i = 0; i < array.length(); i++) {
            String row = array.getString(i);
            String neighbor_code = row;
            getCountryName(neighbor_code);
        }
        country.put("neighbors", neighbors);
        db.collection("users").document(user_id).
                collection("countries").document(obj.get("alpha2Code").toString())
                .set(country)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.d("GetInfoActivity", "DocumentSnapshot successfully written!");
                        Toast.makeText(GetInfoActivity.this, "Information successfully saved to database!",
                                Toast.LENGTH_LONG).show();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w("GetInfoActivity", "Error writing document", e);
                    }
                });

    }
    private void displayInfo(JSONObject obj) throws JSONException {
        Intent intent = getIntent();

        Map<String, Object> country = new HashMap<>();
        country.put("name", obj.get("name"));
        country.put("capital", obj.get("capital"));
        JSONArray array = (JSONArray) obj.get("currencies");
        List<String> data = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            JSONObject row = array.getJSONObject(i);
            String currencyname = row.getString("name");
            data.add(currencyname);
        }

        country.put("currencies", data);
        country.put("checkin_time", currentDate());
        country.put("latitude", intent.getDoubleExtra("lat", 0));
        country.put("longitude", intent.getDoubleExtra("long", 0));
        country.put("population", obj.get("population"));
        items = new ArrayList<String>();
        String name = ((country == null) || (country.get("name") == null) ? "N/A" : country.get("name").toString());
        String checkin_time = ((country == null) || (country.get("checkin_time") == null) ? "N/A" : country.get("checkin_time").toString());
        String latitude = ((country == null) || (country.get("latitude") == null) ? "N/A" : country.get("latitude").toString());
        String longitude = ((country == null) || (country.get("longitude") == null) ? "N/A" : country.get("longitude").toString());
        String population = ((country == null) || (country.get("population") == null) ? "N/A" : country.get("population").toString());
        String currencies = ((country == null) || (country.get("currencies") == null) ? "N/A" : country.get("currencies").toString());
        items.add("Your Country's Name: " + name);
        items.add("Checked-in Time: " + checkin_time);
        items.add("Checked-in Coordinates: (" + latitude + ", " + longitude + ")");
        items.add("Population: " + population + " people");
        items.add("Currencies: " + currencies);
        itemsAdapter =
                new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, items);
        listView.setAdapter(itemsAdapter);

    }

    private String currentDate(){
        String DATE_FORMAT = "dd/MM/yyyy hh:mm:ss a";
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("GMT-5"));
        System.out.println("TimeZone of calendar : " + calendar.getTimeZone().getID());
        SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
        formatter.setTimeZone(TimeZone.getTimeZone("GMT-5"));
        System.out.println("Central Daylight Time : " + formatter.format(calendar.getTime()));
        return formatter.format(calendar.getTime());
    }
    private void getCountryName(String code) {
        String url = "https://restcountries.eu/rest/v2/alpha/"  + code;
        RequestQueue queue = Volley.newRequestQueue(this);
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.GET, url, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d("Response","Response: " + response.toString());
                        try {
                            Log.d("Neighbor's Name", response.get("name").toString() );
                            neighbors.add(response.get("name").toString());
                            saveNeighborToDB();
                            displayNeighbor();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("Error","Response ERROR!");
                    }
                });
        queue.add(jsonObjectRequest);
    }
    private void saveNeighborToDB(){
        String user_id = mAuth.getCurrentUser().getUid();
        Map<String, Object> neighbor_map = new HashMap<>();
        neighbor_map.put("neighbors", neighbors);
        db.collection("users").document(user_id).
                collection("countries").document(country_code)
                .set(neighbor_map, SetOptions.merge())
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.d("GetInfoActivity", "DocumentSnapshot successfully updated with new neighbor!");
                        Toast.makeText(GetInfoActivity.this, "Neighbor successfully saved to database!",
                                Toast.LENGTH_LONG).show();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w("GetInfoActivity", "Error writing document", e);
                    }
                });

    }
    private void displayNeighbor(){
        Log.d("current neighbors ", neighbors.toString());
        if (items.get(items.size()-1).contains("Neighbors: ")){
            items.remove(items.remove(items.size()-1));
            items.add("Neighbors: " + neighbors.toString());
        }
        else{
            items.add("Neighbors: " + neighbors.toString());
        }
        itemsAdapter =
                new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, items);
        listView.setAdapter(itemsAdapter);

    }
}
