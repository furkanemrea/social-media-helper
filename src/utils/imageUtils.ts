export const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(`http://ec2-13-60-250-114.eu-north-1.compute.amazonaws.com:9898/convert-to-base64?url=${encodeURIComponent(imageUrl)}`);
    const data = await response.json();

    return "data:image/jpeg;base64,"+data.base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);  
    throw error;
  }
}; 