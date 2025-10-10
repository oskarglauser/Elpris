export class StorageService {
  static getAppliances() {
    const saved = localStorage.getItem('appliances');
    return saved ? JSON.parse(saved) : [];
  }

  static saveAppliances(appliances) {
    localStorage.setItem('appliances', JSON.stringify(appliances));
  }

  static getSelectedRegion() {
    return localStorage.getItem('selectedRegion') || 'SE3';
  }

  static saveSelectedRegion(region) {
    localStorage.setItem('selectedRegion', region);
  }
}
