import json, urllib.request, urllib.parse, time
desa_list = []
try:
    with open('asas-kecamatan.json') as f:
        kec = json.load(f)
    for k in kec:
        desa_list.append((k['kecamatan'], k['kecamatan']))
except:
    pass
print('Mau tarik titik SE Pandeglang:', len(desa_list))
hasil = []
for desa, kec in desa_list:
    q = desa + ', ' + kec + ', Pandeglang, Banten, Indonesia'
    url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={'User-Agent': 'Zeevanna-Jek-ASAS'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            j = json.loads(r.read())
            if j:
                lat = j[0]['lat']
                lon = j[0]['lon']
                hasil.append({'desa': desa, 'kecamatan': kec, 'lat': float(lat), 'lng': float(lon), 'sumber': 'Nominatim + ASAS'})
                print('OK', desa, kec, '->', lat, lon)
            else:
                print('NGGAK KETEMU', desa)
    except Exception as e:
        print('ERROR', desa, e)
    time.sleep(1)
with open('asas-pandeglang.json', 'w') as f:
    json.dump(hasil, f, indent=2)
print('Selesai! Tersimpan di asas-pandeglang.json, jumlah:', len(hasil))
print('Kaduhejo Ciputri ke Saketi Ujung = titik ke titik, 15 km, bukan 7 km!')
