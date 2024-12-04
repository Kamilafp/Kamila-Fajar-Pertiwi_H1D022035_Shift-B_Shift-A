import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nama = '';
  dataResep: any;
  modalTambah: any;
  id: any;
  nama_makanan: any;
  langkah: any;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private api: ApiService,
    private modal: ModalController,
    private alertController: AlertController
  ) {
    this.nama = this.authService.nama;
  }
  ngOnInit() {
    this.getResep();
  }

  getResep() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataResep = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  resetModal() {
    this.id = null;
    this.nama_makanan = '';
    this.langkah = '';
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }

  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  tambahResep() {
    if (this.nama_makanan != '' && this.langkah != '') {
      let data = { nama_makanan: this.nama_makanan, langkah: this.langkah};
      this.api.tambah(data, 'tambah.php').subscribe({
        next: (hasil: any) => {
          this.resetModal();
          console.log('berhasil tambah Resep');
          this.getResep();
          this.modalTambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah resep');
        }
      });
    } else {
      console.log('gagal tambah resep karena masih ada data yg kosong');
    }
  }

  async confirmDelete(id: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus data resep ini?',
      buttons: [
        {
          text: 'Hapus',
          handler: () => {
            this.hapusResep(id);
          }
        },
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Hapus dibatalkan');
          }
        }
      ]
    });
    await alert.present();
  }

  hapusResep(id: any) {
    this.api.hapus(id, 'hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('berhasil hapus data');
        this.getResep();
      },
      error: (error: any) => {
        console.log('gagal');
      }
    });
  }

  ambilResep(id: any) {
    this.api.lihat(id, 'lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let makanan = hasil;
        this.id = makanan.id;
        this.nama_makanan = makanan.nama_makanan;
        this.langkah = makanan.langkah;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      }
    });
  }

  modalEdit: any;

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilResep(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }

  editResep() {
    let data = { id: this.id, nama_makanan: this.nama_makanan, langkah: this.langkah };
    this.api.edit(data, 'edit.php').subscribe({
      next: (hasil: any) => {
        console.log('berhasil edit Resep');
        this.resetModal();
        this.getResep();
        this.modalEdit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Resep');
      }
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}