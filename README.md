## TUGAS 8 PERTEMUAN 10

### 1. main.dart
**Fungsi**: Entry point (pintu masuk) aplikasi Flutter

```dart
void main() => runApp(const MyApp());
```

- **MyApp**: Widget root aplikasi yang mengonfigurasi theme dan home screen
- **MaterialApp**: Widget Flutter standard untuk aplikasi Material Design
- **home: ProdukPage()**: Menentukan halaman pertama yang dibuka adalah ProdukPage (daftar produk)
- `debugShowCheckedModeBanner: false`: Menghilangkan banner debug di sudut kanan

---

### 2. login_page.dart
**Fungsi**: Halaman login user dengan email & password

#### Struktur Utama:
```dart
class LoginPage extends StatefulWidget  // Bisa berubah state
  └── _LoginPageState                   // Implementasi UI & logic
```

#### Komponen Penting:

| Komponen | Fungsi |
|----------|--------|
| `_formKey` | Referensi form untuk validasi |
| `_emailTextboxController` | Mengelola input email |
| `_passwordTextboxController` | Mengelola input password |
| `_isLoading` | Flag untuk tampil loading indicator |

#### Validasi:
- Email harus diisi
- Password minimal 6 karakter


#### Penjelasan Kode Penting:

**A. Inisialisasi Controllers:**
```dart
final _emailTextboxController = TextEditingController();
final _passwordTextboxController = TextEditingController();
```
Digunakan untuk mengelola nilai input dari TextFormField. Setiap controller menyimpan nilai yang diinput user.

**B. Dispose Method:**
```dart
@override
void dispose() {
  _emailTextboxController.dispose();
  _passwordTextboxController.dispose();
  super.dispose();
}
```
Penting untuk cleanup resource controller ketika halaman ditutup. Mencegah memory leak.

**C. Build Method:**
```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('Login Adnan')),
    body: SingleChildScrollView(
      child: Padding(...)
    ),
  );
}
```
- **Scaffold**: Struktur dasar Material Design (AppBar, Body, Drawer, FloatingButton, dll)
- **SingleChildScrollView**: Membuat konten bisa di-scroll jika melebihi screen height
- **Padding**: Memberikan jarak dari tepi screen

**D. Email TextField:**
```dart
Widget _emailTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Email"),
    keyboardType: TextInputType.emailAddress,
    controller: _emailTextboxController,
    validator: (value) {
      if (value == null || value.isEmpty) {
        return 'Email harus diisi';
      }
      return null;
    },
  );
}
```
- **TextFormField**: Input field dengan built-in validasi
- **keyboardType**: Tipe keyboard yang ditampilkan (email, number, text, dll)
- **validator**: Fungsi yang return error message jika input tidak valid, return null jika valid

**E. Password TextField:**
```dart
Widget _passwordTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Password"),
    keyboardType: TextInputType.text,
    obscureText: true,
    controller: _passwordTextboxController,
    validator: (value) {
      if (value == null || value.isEmpty) {
        return "Password harus diisi";
      }
      if (value.length < 6) {
        return "Password minimal 6 karakter";
      }
      return null;
    },
  );
}
```
- **obscureText: true**: Menyembunyikan karakter yang diinput (berguna untuk password)
- **validator**: Mengecek apakah password kosong dan panjangnya minimal 6 karakter

**F. Button Login:**
```dart
Widget _buttonLogin() {
  return ElevatedButton(
    onPressed: _isLoading ? null : _handleLogin,
    child: _isLoading
        ? const SizedBox(
            height: 20,
            width: 20,
            child: CircularProgressIndicator(strokeWidth: 2),
          )
        : const Text("Login"),
  );
}
```
- **onPressed: _isLoading ? null : _handleLogin**: Tombol disabled saat loading, berfungsi normal saat tidak loading
- **Conditional child**: Menampilkan loading spinner saat loading, text "Login" saat tidak

**G. Handle Login:**
```dart
Future<void> _handleLogin() async {
  if (_formKey.currentState!.validate()) {
    setState(() {
      _isLoading = true;
    });

    try {
      String email = _emailTextboxController.text;
      String password = _passwordTextboxController.text;

      // TODO: API call di sini
      // var result = await AuthService.login(email, password);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login dengan email: $email'))
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e'))
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
}
```
- **validate()**: Menjalankan semua validator di form, return true jika semua valid
- **setState()**: Memicu rebuild widget saat state berubah
- **try-catch-finally**: Error handling pattern - try (eksekusi), catch (handle error), finally (cleanup)
- **ScaffoldMessenger**: Widget untuk menampilkan SnackBar (pesan di bawah screen)

**H. Menu Registrasi:**
```dart
Widget _menuRegistrasi() {
  return Center(
    child: InkWell(
      child: const Text("Registrasi", style: TextStyle(color: Colors.blue)),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const RegistrasiPage()),
        );
      },
    ),
  );
}
```
- **InkWell**: Widget yang bisa diklik dengan ripple effect
- **Navigator.push**: Menambahkan halaman baru ke navigation stack
- **MaterialPageRoute**: Animasi transisi antar halaman

**Screenshot login_page.dart:**

<img width="626" height="879" alt="image" src="https://github.com/user-attachments/assets/c0aacaf4-e2ed-47f1-b23f-57d199501b8a" />

---

### 3. registrasi_page.dart
**Fungsi**: Halaman registrasi akun baru

#### Input Fields:

| Field | Validasi |
|-------|----------|
| Nama | Minimal 3 karakter |
| Email | Format email valid (regex) |
| Password | Minimal 6 karakter |
| Konfirmasi Password | Harus sama dengan password |

#### Fitur Penting:
- Email validation dengan regex pattern
- Password confirmation matching
- Loading state saat registrasi
- Responsive form dengan SingleChildScrollView

#### Flow:
```
User input semua field 
  ↓
Validasi (nama, email, password, konfirmasi) 
  ↓
Tampil loading 
  ↓
Simulasi API registrasi 2 detik 
  ↓
Tampil pesan sukses 
  ↓
(Opsional) Kembali ke login
```

#### Penjelasan Kode Penting:

**A. Inisialisasi:**
```dart
final _formKey = GlobalKey<FormState>();
bool _isLoading = false;
final _namaTextboxController = TextEditingController();
final _emailTextboxController = TextEditingController();
final _passwordTextboxController = TextEditingController();
```
Sama seperti LoginPage, siapkan form key dan controller untuk setiap input field.

**B. Nama TextField:**
```dart
Widget _namaTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Nama"),
    keyboardType: TextInputType.text,
    controller: _namaTextboxController,
    validator: (value) {
      if (value!.length < 3) {
        return "Nama harus diisi minimal 3 karakter";
      }
      return null;
    },
  );
}
```
- Validasi nama minimal 3 karakter

**C. Email TextField dengan Regex Validation:**
```dart
Widget _emailTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Email"),
    keyboardType: TextInputType.emailAddress,
    controller: _emailTextboxController,
    validator: (value) {
      if (value!.isEmpty) {
        return 'Email harus diisi';
      }
      String pattern = r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
      RegExp regex = RegExp(pattern);
      if (!regex.hasMatch(value)) {
        return "Email tidak valid";
      }
      return null;
    },
  );
}
```
- **RegExp**: Regular Expression untuk validasi format email yang kompleks
- Pattern regex mengecek format email standard (user@domain.com)

**D. Password TextField:**
```dart
Widget _passwordTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Password"),
    keyboardType: TextInputType.text,
    obscureText: true,
    controller: _passwordTextboxController,
    validator: (value) {
      if (value!.length < 6) {
        return "Password harus diisi minimal 6 karakter";
      }
      return null;
    },
  );
}
```
- Validasi password minimal 6 karakter
- obscureText: true untuk menyembunyikan karakter

**E. Konfirmasi Password TextField:**
```dart
Widget _passwordKonfirmasiTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Konfirmasi Password"),
    keyboardType: TextInputType.text,
    obscureText: true,
    validator: (value) {
      if (value != _passwordTextboxController.text) {
        return "Konfirmasi Password tidak sama";
      }
      return null;
    },
  );
}
```
- Membandingkan nilai konfirmasi password dengan password field
- Tidak memerlukan controller karena hanya untuk validasi

**F. Button Registrasi:**
```dart
Widget _buttonRegistrasi() {
  return ElevatedButton(
    child: _isLoading
        ? const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
          )
        : const Text("Registrasi"),
    onPressed: () {
      if (_isLoading) return;

      var validate = _formKey.currentState!.validate();

      if (validate) {
        setState(() {
          _isLoading = true;
        });

        Future.delayed(const Duration(seconds: 2), () {
          setState(() {
            _isLoading = false;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Registrasi Berhasil!')),
          );
        });
      }
    },
  );
}
```
- **Future.delayed()**: Menjalankan kode setelah delay tertentu (simulasi API call 2 detik)
- Loading indicator menggantikan text tombol saat proses berlangsung

**Screenshot registrasi_page.dart:**


<img width="625" height="888" alt="Screenshot 2025-11-23 091753" src="https://github.com/user-attachments/assets/eafef37f-3579-474b-8f9a-483308fabe4e" />

---

### 4. produk_page.dart
**Fungsi**: Menampilkan daftar semua produk

#### Struktur:
```
ProdukPage
├── AppBar
│   ├── Title: "List Produk Adnan"
│   └── Icon (+) untuk tambah produk
├── Drawer (Navigation menu)
│   └── Logout button
└── ListView
    ├── ItemProduk 1 (Kamera - 5.000.000)
    ├── ItemProduk 2 (Kulkas - 2.500.000)
    └── ItemProduk 3 (Mesin Cuci - 2.000.000)
```

#### Komponen:
- **AppBar**: Header dengan title dan icon add
- **Drawer**: Menu navigasi sidebar (contoh: logout)
- **ListView**: Daftar produk dalam Card & ListTile
- **ItemProduk**: Widget custom untuk menampilkan satu produk

#### Interaksi:

| Aksi | Navigasi |
|------|----------|
| Klik icon (+) | Ke ProdukForm (tambah) |
| Klik item produk | Ke ProdukDetail |
| Logout di drawer | (akan diimplementasi) |

#### Data Produk (Hardcoded saat ini):
```dart
Produk(
  id: 1,
  kodeProduk: 'A001',
  namaProduk: 'Kamera',
  hargaProduk: 5000000,
)
```

#### Penjelasan Kode Penting:

**A. ProdukPage Build:**
```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text('List Produk Adnan'),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 20.0),
          child: GestureDetector(
            child: const Icon(Icons.add, size: 26.0),
            onTap: () async {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ProdukForm()),
              );
            },
          ),
        ),
      ],
    ),
    ...
  );
}
```
- **actions**: Tombol-tombol di sebelah kanan AppBar
- **GestureDetector**: Widget untuk mendeteksi gesture (tap, drag, dll)
- **Navigator.push**: Navigasi ke halaman ProdukForm

**B. Drawer:**
```dart
drawer: Drawer(
  child: ListView(
    children: [
      ListTile(
        title: const Text('Logout'),
        trailing: const Icon(Icons.logout),
        onTap: () async {},
      ),
    ],
  ),
),
```
- **Drawer**: Panel yang bisa ditarik dari sisi screen
- **ListTile**: Widget untuk list item dengan title, subtitle, leading, trailing

**C. ListView dengan ItemProduk:**
```dart
body: ListView(
  children: [
    ItemProduk(
      produk: Produk(
        id: 1,
        kodeProduk: 'A001',
        namaProduk: 'Kamera',
        hargaProduk: 5000000,
      ),
    ),
    ItemProduk(...),
    ItemProduk(...),
  ],
),
```
- **ListView**: Widget untuk menampilkan list yang bisa di-scroll
- Setiap item adalah widget ItemProduk custom

**D. ItemProduk Widget:**
```dart
class ItemProduk extends StatelessWidget {
  final Produk produk;
  const ItemProduk({Key? key, required this.produk}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => ProdukDetail(produk: produk)),
        );
      },
      child: Card(
        child: ListTile(
          title: Text(produk.namaProduk!),
          subtitle: Text(produk.hargaProduk.toString()),
        ),
      ),
    );
  }
}
```
- **Card**: Widget yang menampilkan elevation/shadow
- **ListTile**: Menampilkan produk dengan title (nama) dan subtitle (harga)
- **GestureDetector**: Ketika tap, navigate ke ProdukDetail dengan membawa data produk

**Catatan**: Produk masih hardcoded. Nanti bisa diganti dengan API call untuk fetch dari backend.

**Screenshot produk_page.dart:**

<img width="619" height="874" alt="Screenshot 2025-11-23 092745" src="https://github.com/user-attachments/assets/3e164964-45e8-401a-8145-2dcc66178a69" />

---

### 5. produk_detail.dart
**Fungsi**: Menampilkan detail produk satu item + aksi edit/hapus

#### Info yang ditampilkan:
```
Kode : A001
Nama : Kamera
Harga : Rp. 5000000
```

#### Tombol Aksi:

| Tombol | Aksi |
|--------|------|
| EDIT | Navigasi ke ProdukForm dengan data produk |
| DELETE | (TODO) Konfirmasi hapus, lalu delete ke API |

#### Flow Detail Produk:
```
User klik item di ProdukPage 
  ↓
Tampil ProdukDetail dengan data produk 
  ↓
User bisa: EDIT atau DELETE
  ├─ EDIT → ProdukForm (pre-fill data)
  └─ DELETE → Konfirmasi dialog (belum diimplementasi)
```

#### Penjelasan Kode Penting:

**A. ProdukDetail Class:**
```dart
class ProdukDetail extends StatefulWidget {
  Produk? produk;
  ProdukDetail({Key? key, this.produk}) : super(key: key);
  @override
  _ProdukDetailState createState() => _ProdukDetailState();
}
```
- **Produk? produk**: Parameter optional, menerima objek Produk dari halaman sebelumnya
- **? (nullable)**: Menandakan parameter bisa null

**B. Build Detail:**
```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('Detail Produk Adnan')),
    body: Center(
      child: Column(
        children: [
          Text(
            "Kode : ${widget.produk!.kodeProduk}",
            style: const TextStyle(fontSize: 20.0),
          ),
          Text(
            "Nama : ${widget.produk!.namaProduk}",
            style: const TextStyle(fontSize: 18.0),
          ),
          Text(
            "Harga : Rp. ${widget.produk!.hargaProduk.toString()}",
            style: const TextStyle(fontSize: 18.0),
          ),
          _tombolHapusEdit(),
        ],
      ),
    ),
  );
}
```
- **widget.produk!**: Mengakses parameter dari widget parent menggunakan ! (force unwrap)
- String interpolation dengan ${} untuk memasukkan nilai variable ke dalam string
- **Center**: Menempatkan child di tengah screen
- **Column**: Layout vertikal

**C. Tombol Edit dan Delete:**
```dart
Widget _tombolHapusEdit() {
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      OutlinedButton(
        child: const Text("EDIT"),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ProdukForm(produk: widget.produk!),
            ),
          );
        },
      ),
      OutlinedButton(
        child: const Text("DELETE"),
        onPressed: () => {},
      ),
    ],
  );
}
```
- **Row**: Layout horizontal
- **OutlinedButton**: Tombol dengan outline (border) saja, tidak ada background color
- EDIT button: Navigate ke ProdukForm dan pass produk data untuk di-edit
- DELETE button: Masih kosong, bisa diimplementasi untuk konfirmasi hapus + API call

**Screenshot produk_detail.dart:**

[Letakkan screenshot halaman detail produk di sini]

---

### 6. produk_form.dart
**Fungsi**: Form untuk menambah atau mengubah produk

#### State Management:
```dart
final _kodeProdukTextboxController      // Input kode produk
final _namaProdukTextboxController      // Input nama produk
final _hargaProdukTextboxController     // Input harga
bool _isLoading                         // Loading state
String judul                            // "TAMBAH" atau "UBAH"
String tombolSubmit                     // "SIMPAN" atau "UBAH"
```

#### Flow Submit:
```
User isi form 
  ↓
Klik SIMPAN/UBAH 
  ↓
Validasi form 
  ↓
Tampil loading spinner (2 detik simulasi) 
  ↓
Tampil SnackBar sukses 
  ↓
Pop/kembali ke halaman sebelumnya
```

#### Penjelasan Kode Penting:

**A. ProdukForm Class:**
```dart
class ProdukForm extends StatefulWidget {
  Produk? produk;
  ProdukForm({Key? key, this.produk}) : super(key: key);
  @override
  _ProdukFormState createState() => _ProdukFormState();
}
```
- Parameter **Produk? produk**: Optional, jika null berarti mode TAMBAH, jika ada data berarti mode UBAH

**B. initState dan isUpdate:**
```dart
@override
void initState() {
  super.initState();
  isUpdate();
}

isUpdate() {
  if (widget.produk != null) {
    setState(() {
      judul = "UBAH PRODUK ADNAN";
      tombolSubmit = "UBAH";
      _kodeProdukTextboxController.text = widget.produk!.kodeProduk!;
      _namaProdukTextboxController.text = widget.produk!.namaProduk!;
      _hargaProdukTextboxController.text = widget.produk!.hargaProduk.toString();
    });
  } else {
    judul = "TAMBAH PRODUK ADNAN";
    tombolSubmit = "SIMPAN";
  }
}
```
- **initState()**: Lifecycle method yang dijalankan sekali saat widget pertama kali dibuat
- **isUpdate()**: Fungsi untuk mengecek apakah form untuk edit atau tambah
- Jika ada produk (dari parameter), pre-fill form dengan data produk dan ubah judul/tombol
- Jika tidak ada produk, tampilkan form kosong dengan judul dan tombol untuk tambah

**C. Text Field - Kode Produk:**
```dart
Widget _kodeProdukTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Kode Produk"),
    keyboardType: TextInputType.text,
    controller: _kodeProdukTextboxController,
    validator: (value) {
      if (value!.isEmpty) {
        return "Kode Produk harus diisi";
      }
      return null;
    },
  );
}
```
- Validasi: Kode produk harus diisi (tidak boleh kosong)

**D. Text Field - Nama Produk:**
```dart
Widget _namaProdukTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Nama Produk"),
    keyboardType: TextInputType.text,
    controller: _namaProdukTextboxController,
    validator: (value) {
      if (value!.isEmpty) {
        return "Nama Produk harus diisi";
      }
      return null;
    },
  );
}
```
- Validasi: Nama produk harus diisi

**E. Text Field - Harga Produk:**
```dart
Widget _hargaProdukTextField() {
  return TextFormField(
    decoration: const InputDecoration(labelText: "Harga"),
    keyboardType: TextInputType.number,
    controller: _hargaProdukTextboxController,
    validator: (value) {
      if (value!.isEmpty) {
        return "Harga harus diisi";
      }
      return null;
    },
  );
}
```
- **keyboardType: TextInputType.number**: Menampilkan numeric keyboard
- Validasi: Harga harus diisi

**F. Button Submit:**
```dart
Widget _buttonSubmit() {
  return OutlinedButton(
    child: _isLoading
        ? const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(strokeWidth: 2.5),
          )
        : Text(tombolSubmit),
    onPressed: () {
      if (_isLoading) return;

      var validate = _formKey.currentState!.validate();
      if (validate) {
        setState(() {
          _isLoading = true;
        });

        Future.delayed(const Duration(seconds: 2), () {
          setState(() {
            _isLoading = false;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                widget.produk == null
                    ? "Produk berhasil disimpan"
                    : "Produk berhasil diubah",
              ),
            ),
          );

          Navigator.of(context).pop();
        });
      }
    },
  );
}
```
- **onPressed**: Ketika tombol diklik
- Cek jika sedang loading, return (jangan proses)
- Validasi form
- Set loading state true, tampilkan spinner
- Simulasi API call dengan Future.delayed 2 detik
- Setelah selesai, set loading false, tampilkan SnackBar, kembali ke halaman sebelumnya dengan Navigator.pop()
- Pesan sukses berbeda untuk tambah vs edit

**Screenshot produk_form.dart (Tambah):**

<img width="635" height="864" alt="Screenshot 2025-11-23 092753" src="https://github.com/user-attachments/assets/01065532-1e57-4d59-a652-559b39677a88" />

**Screenshot produk_form.dart (Edit):**

<img width="625" height="875" alt="Screenshot 2025-11-23 092800" src="https://github.com/user-attachments/assets/19fb09bf-f6d5-4322-a4e1-b274685b2e7c" />

---
