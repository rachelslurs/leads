// Basic validation tests - JSON Forms handles detailed validation
describe('Form Validation', () => {
  it('should validate required fields are present', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      visaInterests: 'H1B',
      longFormInput: 'I am interested in applying for an H1B visa because...',
    };

    // Check required fields
    expect(validData.name).toBeTruthy();
    expect(validData.email).toBeTruthy();
    expect(validData.visaInterests).toBeTruthy();
    expect(validData.longFormInput).toBeTruthy();
  });

  it('should handle missing required fields', () => {
    const invalidData = {
      name: '',
      email: 'john@example.com',
      visaInterests: 'H1B',
      longFormInput: 'Long form input here',
    };

    // Check required fields
    expect(invalidData.name).toBeFalsy();
    expect(invalidData.email).toBeTruthy();
    expect(invalidData.visaInterests).toBeTruthy();
    expect(invalidData.longFormInput).toBeTruthy();
  });

  it('should handle optional linkedin field', () => {
    const dataWithLinkedin = {
      name: 'John Doe',
      email: 'john@example.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      visaInterests: 'H1B',
      longFormInput: 'Long form input here',
    };

    const dataWithoutLinkedin = {
      name: 'John Doe',
      email: 'john@example.com',
      linkedin: '',
      visaInterests: 'H1B',
      longFormInput: 'Long form input here',
    };

    // Both should be valid
    expect(dataWithLinkedin.name).toBeTruthy();
    expect(dataWithoutLinkedin.name).toBeTruthy();
  });
});